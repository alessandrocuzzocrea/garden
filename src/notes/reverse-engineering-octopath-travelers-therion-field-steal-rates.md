---
title: Reverse Engineering Therion's Steal Success Rate in Octopath Traveler
permalink: /reverse-engineering-octopath-traveler-therion-steal-success-rate/
tags:
  - game-dev
  - reverse-engineering
  - coding
---
So I was playing OCTOPATH TRAVELER (wonderful game, btw), but I had a suspicion that the game was BS-ing me about the steal rates.

So I wanted to know *exactly* how the game decides whether Therion gets to steal an item.

**This is about the field Steal Path Action** (stealing from town NPCs), not the Thief job's battle steal skills.

> **Disclaimer**  
> This is for understanding the game.  
I don't redistribute the disassembled code or assets.

## TL;DR

* The roll is a single call: `RandomBoolWithWeight(min(percent * 0.01, 1))`.
* The percent comes from a **7-bucket lookup** based on `effective field-command level − ProperSteal`.
* Therion's effective field-command level is his character level **plus the Steal bonus from Thieving Tips & Tricks, if he has it**, capped at 99.
* `ProperSteal` is the steal difficulty assigned to the item **for that specific NPC**, rather than to the item itself.
* The seven success rates are defined in `Content/GameParam/GameParamDefineTable`: `3, 8, 15, 55, 65, 80, 100`.

| Difference  | Chance |
| ----------- | -----: |
| 11 or more  |   100% |
| 4 to 10     |    80% |
| 2 to 3      |    65% |
| 0 to 1      |    55% |
| −1 to −3    |    15% |
| −4 to −10   |     8% |
| −11 or less |     3% |


## The steal formula

`FieldCommandPurchase_C.StealItemExec` is where the decision is made.

Decompiled to pseudocode:

```csharp
diff = Subtract_IntInt(this.FieldCommandLevel, PurchaseItemInfoData.ProperSteal);

// Both getters fill four out-params from one DataTable row: (min, max, init, param)

//   STEAL_PROBABILITY_LESS_THAN           3,   8,  15,  55    -> the low buckets
//   STEAL_PROBABILITY_OVER               65,  80, 100,   0    -> the high buckets
//   STEAL_PROBABILITY_LEVEL_OVER           2,   4,  11,   0    -> thresholds, high side
//   STEAL_PROBABILITY_LEVEL_LESS_THAN    -11,  -4,  -1,   0    -> thresholds, low side

if (diff == 0) {
    GetGameParamToFloat("STEAL_PROBABILITY_LESS_THAN", this, out LessMin, out LessMax, out LessInit, out LessParam);
    weight = LessParam;                              // 55
}
else if (diff > 0) {
    GetGameParamToInt  ("STEAL_PROBABILITY_LEVEL_OVER", this, out LvMin, out LvMax, out LvInit, out LvParam);
    GetGameParamToFloat("STEAL_PROBABILITY_OVER",       this, out OverMin, out OverMax, out OverInit, out OverParam);
    if      (diff >= LvInit) weight = OverInit;      // 100   (LvInit = 11)
    else if (diff >= LvMax)  weight = OverMax;       // 80    (LvMax = 4)
    else if (diff >= LvMin)  weight = OverMin;       // 65    (LvMin = 2)
    else {
        GetGameParamToFloat("STEAL_PROBABILITY_LESS_THAN", this, out LessMin, out LessMax, out LessInit, out LessParam);
        weight = LessParam;                          // 55    (diff == 1: no high bucket matched)
    }
}
else {
    GetGameParamToInt  ("STEAL_PROBABILITY_LEVEL_LESS_THAN", this, out LvMin, out LvMax, out LvInit, out LvParam);
    GetGameParamToFloat("STEAL_PROBABILITY_LESS_THAN",       this, out LessMin, out LessMax, out LessInit, out LessParam);
    if      (diff <= LvMin)  weight = LessMin;       // 3     (LvMin = -11)
    else if (diff <= LvMax)  weight = LessMax;       // 8     (LvMax = -4)
    else if (diff <= LvInit) weight = LessInit;      // 15    (LvInit = -1)
    // else: unreachable — every diff < 0 already satisfied diff <= -1
}

// and finally, the roll:
weight01 = FMin(weight * 0.01f, 1f);
this.SuccessSteal = RandomBoolWithWeight(weight01);
```

### FieldCommandLevel

`FieldCommandLevel` is not Therion's raw level:

```csharp
// FieldCommandPurchase_C.Open(NPCLabel, StealMode)
if (StealMode) {
    LibFieldCommand_C.GetFieldCommandLevelFromType(2, true, this, out this.FieldCommandLevel);   // (byte)2 = eSteal
} else {
    LibFieldCommand_C.GetFieldCommandLevelFromType(1, true, this, out this.FieldCommandLevel);   // (byte)1 = ePurchase
}
```

The field-command level for command type 2 is `KSFIeldCommandType::eSteal`.

The `CheckFCItem=True` argument is what enables the `Thieving Tips & Tricks` bonus lookup.

The decompiled function finds the traveler whose `PlayableCharacterDB` row matches the command type, reads **that character's level from the save**, then adds the bonus and clamps the result to 99.

99 is the number of rows in `CharacterGrowData`, which has one row per level, named `1` through `99`.

```csharp
static public void GetFieldCommandLevelFromType(byte CommandType, bool CheckFCItem, out int FieldCommandLevel, Object __WorldContext) {
    int CharacterLevel = 0;
    int TmpFieldCommandLevel;

    // which traveler owns this command? Therion for eSteal
    Array<Name> RowNames;
    GetDataTableRowNames(PlayableCharacterDB, out RowNames);
    for (int i = 0; i < RowNames.Num(); i++) {
        PlayableCharacterData Row;
        if (!GetDataTableRowFromName(PlayableCharacterDB, RowNames[i], out Row)) continue;
        if (Row.FieldCommandType != CommandType) continue;

        // their level, straight out of the save
        KSSaveGameBP_C SaveGame;
        GetSaveData(__WorldContext, out SaveGame);
        SaveCharacterData CharacterData;
        SaveGame.GetCharacterData(Row.ID, out CharacterData);
        CharacterLevel = CharacterData.Level;
        break;
    }

    TmpFieldCommandLevel = CharacterLevel;

    if (CheckFCItem && CommandType != 8 && CommandType != 7 && CommandType != 4) {   // not scrutinize / inquire / provoke
        bool FindItem;
        int Value;
        CheckHaveFieldCommandItem(CommandType, __WorldContext, out FindItem, out Value);
        if (FindItem) {
            Array<Name> GrowRowNames;
            GetDataTableRowNames(CharacterGrowData, out GrowRowNames);
            TmpFieldCommandLevel = Min(TmpFieldCommandLevel + Value, GrowRowNames.Num());
        }
    }

    FieldCommandLevel = TmpFieldCommandLevel;
}
```

The steal bonus comes from an actual inventory check.

`CheckHaveFieldCommandItem` looks up `TownTable` using the current town ID and reads two parallel arrays for the command's slot (Steal is slot 1): an `INFO_*` knowledge item and a level value.

**8 of the 28 towns have a Steal entry**, and each one specifies the exact item you need to carry:

| town         | item               | bonus |
| ------------ | ------------------ | ----: |
| `T_Snow_M`   | `INFO_SNO_TMA_003` |   +10 |
| `T_Plain_M`  | `INFO_PLA_TMA_001` |   +10 |
| `T_Sea_L`    | `INFO_SEA_TLA_001` |   +30 |
| `T_Mount_M`  | `INFO_MOU_TMC_002` |   +10 |
| `T_Desert_S` | `INFO_DES_TS_002`  |   +10 |
| `T_Desert_L` | `INFO_DES_TLA_004` |   +10 |
| `T_River_M`  | `INFO_RIV_TMB_004` |   +10 |
| `T_Cliff_L`  | `INFO_CLI_TLA_003` |   +10 |

### ProperSteal

`ProperSteal` is the one part of the formula that isn't stored on the item itself.

The item definitions (`Content/Item/Database/ItemDB`, struct `ItemData`) contain `BuyPrice`, `SellPrice`, `ItemID`, category, attributes, and so on, but **no steal-difficulty field**.

Instead, the difficulty is defined by the NPC's copy of the item.

In `Content/Shop/Database/PurchaseItemTable`, the row struct is literally `PurchaseItemInfoData`, the struct used by the steal code above.

Here are some sample rows from one region's lists (`DesertM_SHOP_FC_02` through `_05`), representing four different NPCs:

| row                    | `ItemLabel`  | `FCPrice` | `ProperSteal` | `ObtainFlag` | `ArrivalStatus` | `PossibleFlag` | `PossibleItemLabel` |
| ---------------------- | ------------ | --------: | ------------: | -----------: | --------------: | -------------: | ------------------- |
| `DesertM_SHOP_FC_02_1` | `ITM_003`    |       330 |             1 |            3 |               1 |              0 | `None`              |
| `DesertM_SHOP_FC_03_1` | `ITM_028`    |       220 |             5 |            3 |               1 |              0 | `None`              |
| `DesertM_SHOP_FC_03_2` | `ITM_AC_050` |       396 |             6 |            3 |               1 |              0 | `None`              |
| `DesertM_SHOP_FC_03_3` | `ITM_WD_006` |      7700 |            10 |            3 |               1 |              0 | `None`              |
| `DesertM_SHOP_FC_04_1` | `ITM_AC_062` |       266 |             6 |            3 |               1 |              0 | `None`              |
| `DesertM_SHOP_FC_05_1` | `ITM_086`    |       228 |             5 |            3 |               1 |              0 | `None`              |

Basically, this means the same item can have different `ProperSteal` values depending on who's holding it, so there is no single steal rate stored on the item itself.

## GameParamDefineTable

`Content/GameParam/GameParamDefineTable` is an Unreal Engine `UDataTable` with **one row per parameter key**, where the parameter name is the row name.

That's why a Blueprint can look up `"STEAL_PROBABILITY_OVER"` directly by string.

The table contains various game settings: backpack size, the damage cap, starting equipment IDs, encounter rates, endroll timings, and the four `STEAL_PROBABILITY_*` rows used by the steal system.

All of these parameters use the same schema, which is why the table looks a little strange.

The `row_name` is the key the Blueprint looks up, so these parameter names appear as string literals in the bytecode.

The four steal-probability rows (86–89) are unusual because all four value slots are used. The steal code reads a different slot depending on the comparison outcome:

| row | name                                | type  | min | max | init | param |
| --- | ----------------------------------- | ----- | --: | --: | ---: | ----: |
| 86  | `STEAL_PROBABILITY_LESS_THAN`       | float |   3 |   8 |   15 |    55 |
| 87  | `STEAL_PROBABILITY_OVER`            | float |  65 |  80 |  100 |     0 |
| 88  | `STEAL_PROBABILITY_LEVEL_LESS_THAN` | int   | -11 |  -4 |   -1 |     0 |
| 89  | `STEAL_PROBABILITY_LEVEL_OVER`      | int   |   2 |   4 |   11 |     0 |

For example, row 86 stores `3, 8, 15, 55` in its generic `Min/Max/Init/Param` fields.

Row 87 has `0` in its fourth slot because the "over" side only needs three probability buckets.

Most other rows use only one of these slots, and that value is often stored in `init` rather than `param`:

| row | name                            | type  | min | max | init | param | note                  |
| --- | ------------------------------- | ----- | --: | --: | ---: | ----: | --------------------- |
| 2   | `BACKPACK_ITEM_MAX`             | int   |   0 |   0 |    1 |    99 | value in `param`      |
| 5   | `BATTLE_DAMAGE_CAP`             | int   |   0 |   0 | 9999 | 99999 | both filled           |
| 7   | `VIBRATION_POWER_LOW`           | float |   0 |   0 |    0 |   0.3 | `param` only          |
| 11  | `TITLE_PLAYERSELECT_CURSORCLIP` | float | 100 | 100 |  100 |   100 | all four are the same |

That's what looked odd at first: `STEAL_PROBABILITY_LESS_THAN = {3, 8, 15, 55}` is using the generic `Min/Max/Init/Param` fields as four separate probability values.

The steal code picks **a different slot for each comparison outcome**, while the corresponding thresholds come from the `LEVEL_*` rows' `Min/Max/Init` values.

## Putting it together

With the values shipped in the game:

| `FieldCommandLevel − ProperSteal` |   Chance | Slot used                               |
| --------------------------------- | -------: | --------------------------------------- |
| ≥ 11                              | **100%** | `STEAL_PROBABILITY_OVER` → `Init`       |
| ≥ 4                               |  **80%** | `STEAL_PROBABILITY_OVER` → `Max`        |
| ≥ 2                               |  **65%** | `STEAL_PROBABILITY_OVER` → `Min`        |
| 0 or 1                            |  **55%** | `STEAL_PROBABILITY_LESS_THAN` → `Param` |
| ≤ −1                              |  **15%** | `STEAL_PROBABILITY_LESS_THAN` → `Init`  |
| ≤ −4                              |   **8%** | `STEAL_PROBABILITY_LESS_THAN` → `Max`   |
| ≤ −11                             |   **3%** | `STEAL_PROBABILITY_LESS_THAN` → `Min`   |

## Versions, tools, etc.

Steam App ID `921570`, build `5272616` (published 2020-07-22), running `++UE4+Release-4.18` as a cooked `-WindowsNoEditor` Shipping package.

Blueprint bytecode sitting inside a roughly 2 GiB `.pak` file.

The `.pak` index is unencrypted (version 4, zlib, 64 KiB blocks), and [FModel](https://github.com/4sval/FModel) exports a clean `.uasset` + `.uexp` pair.

FModel can export the assets, but it doesn't decompile Blueprint bytecode.

For the Blueprint bytecode I used:

[KismetKompiler](https://github.com/tge-was-taken/KismetKompiler) `0.4.0-alpha`
