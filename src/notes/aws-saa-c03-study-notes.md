---
title: AWS Certified Solutions Architect - Associate (SAA-C03) Exam Study Notes
permalink: /aws-saa-c03-study-notes/
tags: 
  - aws
  - certification
  - tech
---
[https://d1.awsstatic.com/training-and-certification/docs-sa-assoc/AWS-Certified-Solutions-Architect-Associate_Exam-Guide.pdf](https://d1.awsstatic.com/training-and-certification/docs-sa-assoc/AWS-Certified-Solutions-Architect-Associate_Exam-Guide.pdf)

[https://d1.awsstatic.com/training-and-certification/docs-sa-assoc/AWS-Certified-Solutions-Architect-Associate_Sample-Questions.pdf](https://d1.awsstatic.com/training-and-certification/docs-sa-assoc/AWS-Certified-Solutions-Architect-Associate_Sample-Questions.pdf)

## Design Resilient Architectures

...

## Design High-Performing Architectures

...

## Design Secure Applications and Architectures

...

## Design Cost-Optimized Architectures

...

## ⭐️EC2

### Lifecycle

<!-- ![Untitled](AWS%20Cert%20Renewal%207761b8a32f1444b6b994a7dadeb3fd71/Untitled.png) -->

You can still be billed if your instance is preparing to hibernate with a stopping state.

### Costs

Billing commences when Amazon EC2 initiates the boot sequence of an AMI instance. Billing ends when the instance terminates, which could occur through a web services command, by running "shutdown -h", or through instance failure. When you stop an instance, AWS shuts it down but **doesn't charge hourly usage for a stopped instance** or data transfer fees. However, **AWS does charge for the storage of any Amazon EBS volumes**.

### Reserved Instances (RIs)

The offering class of a Reserved Instance is either Standard or Convertible. A **Standard Reserved Instance provides a more significant** **discount** than a **Convertible Reserved Instance**, but you can’t exchange a Standard Reserved Instance unlike Convertible Reserved Instances. You can modify Standard and Convertible Reserved Instances. Take note that in Convertible Reserved Instances, **you are allowed to exchange another Convertible Reserved instance with a different instance type and tenancy**. You can also **sell your unused instance for Standard RIs** but not Convertible RIs on the Reserved Instance Marketplace.

### Placement Groups

A placement group is a way of grouping EC2 instances in a single Availability Zone.

- **Cluster** – packs instances close together inside an Availability Zone. This strategy enables workloads to achieve the low-latency network performance necessary for tightly-coupled node-to-node communication that is typical of HPC applications.
- **Partition** – spreads your instances across logical partitions such that groups of instances in one partition do not share the underlying hardware with groups of instances in different partitions. This strategy is typically used by large distributed and replicated workloads, such as Hadoop, Cassandra, and Kafka.
- **Spread** – strictly places a small group of instances across distinct underlying hardware to reduce correlated failures.

⚠️ If you receive a ***capacity error*** when launching an instance in a placement group that already has running instances, **stop and start all of the instances in the placement group, and try the launch again**. Restarting the instances may migrate them to hardware that has capacity for all the requested instances.

## On-Demand Capacity Reservations

By creating Capacity Reservations, **you ensure that you always have access to EC2 capacity when you need it, for as long as you need it.** You can create Capacity Reservations at any time, without entering into a one-year or three-year term commitment, and the capacity is available immediately. Billing starts as soon as the capacity is provisioned and the Capacity Reservation enters the active state. When you no longer need it, cancel the Capacity Reservation to stop incurring charges.

<!-- ![Untitled](AWS%20Cert%20Renewal%207761b8a32f1444b6b994a7dadeb3fd71/Untitled%201.png) -->

### Dedicated instance

A **Dedicated instance** runs in a VPC on hardware that’s dedicated to a single customer.

### Autoscaling

Step scaling policies vs Simple scaling policies:
**Step adjustments are applied:** they increase or decrease the current capacity of your Auto Scaling group, the adjustments vary based on the size of the alarm breach.
The primary issue with **simple scaling** is that **after a scaling activity is started, the policy must wait for the scaling activity or health check replacement to complete and the cooldown period to expire before responding to additional alarms**. Cooldown periods help to prevent the initiation of additional scaling activities before the effects of previous activities are visible.

**Target tracking scaling policy**
With a target tracking scaling policy, you can increase or decrease the current capacity of the group based on a target value for a specific metric. This policy will help resolve the over-provisioning of your resources.

**Suspend and resume scaling**

Used to temporarily pause scaling activities triggered by your scaling policies and scheduled actions.

**Predictive scaling**

Predictive scaling uses machine learning to predict capacity requirements based on historical data from CloudWatch. The machine learning algorithm consumes the available historical data and calculates capacity that best fits the historical load pattern, and then continuously learns based on new data to make future forecasts more accurate.

### Elastic IP

...

### Elastic Network Interface (ENI)

It’s just a virtual network card.

## Elastic Network Adapter (ENA)

...

**Enhanced networking**

Enhanced networking provides higher bandwidth, higher packet per second (PPS) performance, and consistently lower inter-instance latencies. There is no additional charge for using enhanced networking.

### Elastic Fabric Adapter (EFA)

EFA is network interface for Amazon EC2 instances that **provides lower and more consistent latency and higher throughput** than the TCP transport traditionally used in cloud-based HPC systems.

Elastic Network Adapters (ENAs) **provide traditional IP networking features that are required to support VPC networking**. EFAs provide all of the same traditional IP networking features as ENAs, and **they also support OS-bypass capabilities**. OS-bypass enables HPC and machine learning applications to bypass the operating system kernel and communicate directly with the EFA device.

The OS-bypass capabilities of EFAs are not supported on Windows instances. If you attach an EFA to a Windows instance, the instance functions as an Elastic Network Adapter without the added EFA capabilities.

### Detailed Monitoring

Detailed monitoring does not provide metrics for memory usage. CloudWatch does not monitor memory usage in its default set of EC2 metrics and **detailed monitoring just provides a higher frequency of metrics.**

## ⭐️VPC

### Costs

There are no additional charges for creating and using the VPC itself.

### NACL

Network ACL (or NACL) controls traffic to or from a subnet according to a set of inbound and outbound rules.

### VPC endpoints

A VPC endpoint allows you to privately connect your VPC to supported AWS and VPC endpoint services powered by AWS PrivateLink without needing an Internet gateway, NAT computer, VPN connection, or AWS Direct Connect connection. Instances in your VPC do not require public IP addresses to communicate with resources in the service. **Traffic between your VPC and the other service does not leave the Amazon network**.
Q: What if your VPC and the other service are in separate regions? Does it still use Amazon network?

### Gateway Endpoints vs Interface Endpoints

...

<!-- ![Untitled](AWS%20Cert%20Renewal%207761b8a32f1444b6b994a7dadeb3fd71/Untitled%202.png) -->

### NAT Gateway

A NAT Gateway is a **highly available**, managed Network Address Translation (NAT) service for your resources in a **private subnet to access the Internet**. NAT gateway is **created in a specific Availability Zone and implemented with redundancy in that zone**.

A single NAT Gateway in each availability zone is enough.

NAT gateway **hourly usage and data processing rates apply**. Amazon EC2 **charges for data transfer** also apply.

NAT gateways are **not supported for IPv6 traffic**—use an egress-only internet gateway instead.

After you've created a NAT gateway, **you must update the route table associated with one or more of your private subnets to point Internet-bound traffic to the NAT gateway**.

### Egress-Only Internet Gateway

An egress-only internet gateway is a horizontally scaled, redundant, and highly available VPC component that allows outbound communication over **IPv6** from instances in your VPC to the internet and prevents it from initiating an **IPv6** connection with your instances.

## Elastic Load Balancer

Elastic Load Balancers **distribute traffic among EC2 instances across multiple Availability Zones** but not across AWS regions.

### Application Load Balancer

You can’t assign an Elastic IP address to an Application Load Balancer. The alternative method you can do is assign an Elastic IP address to a Network Load Balancer in front of the Application Load Balancer.
Q: Buy why can’t you?

### Network Load Balancer

You can use the Bring Your Own IP (BYOIP) feature to use the trusted IPs as Elastic IP addresses (EIP) to a Network Load Balancer (NLB).

### **Network Access Analyzer**

inspecting ingress and egress traffic. Create a new Network Access Scope to filter and analyze all incoming and outgoing requests.

### Security Groups vs Network Access Control Lists

<!-- ![Untitled](AWS%20Cert%20Renewal%207761b8a32f1444b6b994a7dadeb3fd71/Untitled%203.png) -->

### Flow Logs

VPC Flow Logs is a feature that enables you to capture information about the IP traffic going to and from network interfaces in your VPC.

- Diagnosing overly restrictive security group rules.
- Monitoring the traffic that is reaching your instance.
- Determining the direction of the traffic to and from the network interfaces.

## ⭐️Route 53

- **Simple routing policy** – Use for a single resource that performs a given function for your domain, for example, a web server that serves content for the [example.com](http://example.com/) website. You can use simple routing to create records in a private hosted zone.
- **Failover routing policy** – Use when you want to configure active-passive failover. You can use failover routing to create records in a private hosted zone.
- **Geolocation routing policy** – Use when you want to route traffic based on the location of your users. You can use geolocation routing to create records in a private hosted zone.
- **Geoproximity routing policy** – Use when you want to route traffic based on the location of your resources and, optionally, shift traffic from resources in one location to resources in another.
- **Latency routing policy** – Use when you have resources in multiple AWS Regions and you want to route traffic to the region that provides the best latency. You can use latency routing to create records in a private hosted zone.
- **IP-based routing policy** – Use when you want to route traffic based on the location of your users, and have the IP addresses that the traffic originates from.
- **Multivalue answer routing policy** – Use when you want Route 53 to respond to DNS queries with up to eight healthy records selected at random. You can use multivalue answer routing to create records in a private hosted zone.
- **Weighted routing policy** – Use to route traffic to multiple resources in proportions that you specify. You can use weighted routing to create records in a private hosted zone.

### Active-Active Failover

Use this failover configuration when you want **all of your resources to be available** the majority of the time.

### Active-Passive Failover

Use an active-passive failover configuration when you want a primary resource or group of resources to be available the majority of the time and you want a **secondary resource or group of resources to be on standby** in case all the primary resources become unavailable.

## ⭐️S3

[Amazon S3](https://tutorialsdojo.com/amazon-s3/)

### Tiers

...

<!-- ![Untitled](AWS%20Cert%20Renewal%207761b8a32f1444b6b994a7dadeb3fd71/Untitled%204.png) -->

<!-- ![Untitled](AWS%20Cert%20Renewal%207761b8a32f1444b6b994a7dadeb3fd71/Untitled%205.png) -->

<!-- ![Untitled](AWS%20Cert%20Renewal%207761b8a32f1444b6b994a7dadeb3fd71/Untitled%206.png) -->

### Amazon S3 Access Point

Configure an Amazon S3 Access Point for the S3 bucket to restrict data access to a particular Amazon VPC only.

### S3 Pre-signed URLs vs CloudFront Signed URLs vs Origin Access Identity (OAI)

[S3 Pre-signed URLs vs CloudFront Signed URLs vs Origin Access Identity (OAI)](https://tutorialsdojo.com/s3-pre-signed-urls-vs-cloudfront-signed-urls-vs-origin-access-identity-oai/)

### S3 Object Lock

With S3 Object Lock, you can store objects using a write-once-read-many (WORM) model. Object Lock can help prevent objects from being deleted or overwritten for a fixed amount of time or indefinitely. You can use Object Lock to help meet regulatory requirements that require WORM storage or to simply add another layer of protection against object changes and deletion.
In **governance mode**, users can’t overwrite or delete an object version or alter its lock settings **unless they have special permissions**.
In **compliance mode**, a protected object version can’t be overwritten or deleted by any user, including the root user in your AWS account.
With Object Lock, you can also place a **legal hold** on an object version. Like a **retention period**, a legal hold prevents an object version from being overwritten or deleted. However, a legal hold doesn’t have an associated retention period and **remains in effect until removed**. You **cannot** set a time period for a **legal hold.**

### Transfer Acceleration

Amazon S3 Transfer Acceleration, you can speed up content transfers to and from Amazon S3 by as much as 50-500% for long-distance transfer of larger objects. 

### Multipart upload

Multipart upload allows you to upload a single object as a set of parts. After all the parts of your object are uploaded, Amazon S3 then presents the data as a single object. You can upload parts in parallel to improve throughput.

### Web Hosting

An S3 bucket that is configured to host a static website. **The bucket must have the same name as your domain or subdomain**.

This is stupid because →  

[Amazon S3 bucket name uniqueness and domain name](https://stackoverflow.com/questions/51810310/amazon-s3-bucket-name-uniqueness-and-domain-name)

There is no constraint that the S3 bucket must be in the same region as the hosted zone in order for the Route 53 service to route traffic into it.

### Cross-Region Replication

Possible but takes time. Not the fastest option.

### Pre-signed URLs

Anyone who receives the presigned URL can then access the object.

### Lifecycle Policies

Lifecycle configuration enables you to specify the lifecycle management of objects in a bucket. The configuration is a set of one or more rules, where each rule defines an action for Amazon S3 to apply to a group of objects.

**Transition actions** – In which you define when objects transition to another storage class. For example, you may choose to transition objects to the STANDARD_IA (IA, for infrequent access) storage class 30 days after creation or archive objects to the GLACIER storage class one year after creation.

**Expiration actions** – In which you specify when the objects expire. Then Amazon S3 deletes the expired objects on your behalf.

### S3 Select

Amazon S3 Select is designed to help analyze and process data within an object in Amazon S3 buckets, faster and cheaper. It works by providing the ability to retrieve a subset of data from an object in Amazon S3 using simple SQL expressions.

### Server Access Logging

<!-- ![Untitled](AWS%20Cert%20Renewal%207761b8a32f1444b6b994a7dadeb3fd71/Untitled%207.png) -->

Amazon S3 server access logs provide detailed records for the requests that are made to an S3 bucket.

### Requester Pays

The **requester pays the cost of the data download** from the bucket. 

The bucket owner always pays the cost of storing data.

Take note that if you enable Requester Pays on a bucket, anonymous access to that bucket will not be allowed anymore.

### Server-Side Encryption with Amazon S3-Managed Keys (SSE-S3) vs Server-Side Encryption with Customer Master Keys (CMKs) Stored in AWS Key Management Service (SSE-KMS) vs Server-Side Encryption with Customer-Provided Keys (SSE-C)

Fuck this shit. I don’t give a damn.

## S3 Glacier

Amazon S3 Glacier supports the following archive operations: Upload, Download, and Delete. Archives are immutable and cannot be modified.

#### Expedited Retrival

Allow you to quickly access your data when occasional urgent requests for a subset of archives are required. For all but the largest archives (250 MB+), data accessed using Expedited retrievals are typically made available within 1–5 minutes.

#### Provisioned capacity

Ensures that your retrieval capacity for expedited retrievals is available when you need it. Each unit of capacity provides that at least three expedited retrievals can be performed every five minutes and provides up to 150 MB/s of retrieval throughput. You should purchase provisioned retrieval capacity if your workload requires highly reliable and predictable access to a subset of your data in minutes.

### Vault Lock

An Amazon S3 Glacier (Glacier) vault can have one resource-based vault access policy and one Vault Lock policy attached to it. A Vault Lock policy is a vault access policy that you can lock. Using a Vault Lock policy can help you enforce regulatory and compliance requirements. Amazon S3 Glacier provides a set of API operations for you to manage the Vault Lock policies.

As an example of a Vault Lock policy, suppose that you are required to retain archives for one year before you can delete them.

## ⭐️RDS

Relational Database Service

### Storage Auto Scaling

RDS Storage Auto Scaling continuously monitors actual storage consumption, and scales capacity up automatically when actual utilization approaches provisioned storage capacity. Auto Scaling works with new and existing database instances. **You can enable Auto Scaling with just a few clicks in the AWS Management Console**. There is no additional cost for RDS Storage Auto Scaling. You pay only for the RDS resources needed to run your applications.

### Backups

Maximum backup retention period for automated backup is only 35 days.

You can't export an automated snapshot automatically to Amazon S3. You must export the snapshot manually.

### Multi-AZ deployments

Amazon RDS simply flips the canonical name record (CNAME) for your DB instance to point at the standby, which is in turn promoted to become the new primary.

### IAM database authentication

You can authenticate to your DB instance using AWS Identity and Access Management (IAM) database authentication. IAM database authentication works with MySQL and PostgreSQL. With this authentication method, you don’t need to use a password when you connect to a DB instance. Instead, you use an authentication token.

### Enhanced Monitoring

...

### Amazon RDS Read Replicas

Amazon RDS Read Replicas provide **enhanced performance and durability** for database (DB) instances. This feature makes it easy to **elastically scale out beyond the capacity constraints of a single DB instance for read-heavy database workloads.** You can **create one or more replicas** of a given source DB Instance and serve high-volume application read traffic from multiple copies of your data, thereby increasing aggregate read throughput. **Read replicas can also be promoted when needed to become standalone DB instances**. Read replicas are available in Amazon RDS for MySQL, MariaDB, Oracle, and PostgreSQL as well as Amazon Aurora.

## ⭐️Aurora

### Amazon Aurora Serverless

Amazon Aurora Serverless is an **on-demand, auto-scaling configuration** for Amazon Aurora. An **Aurora Serverless DB cluster is a DB cluster that automatically starts up, shuts down, and scales up or down** its compute capacity based on your application’s needs.

Take note that a **non-Serverless DB cluster for Aurora is called a provisioned DB cluster**.

### Amazon Aurora Global Database

Amazon Aurora Global Database is designed for globally distributed applications, allowing a single Amazon Aurora database to span multiple AWS regions. It replicates your data with no impact on database performance, enables fast local reads with low latency in each region, and provides disaster recovery from region-wide outages.

## Redshift

### Amazon Redshift Spectrum

Enables you to query and analyze all of your data in Amazon S3 using the open data formats you already use, with no data loading or transformations needed.

No loading or transformation is required, and you can use open data formats, including Avro, **CSV**, Grok, ORC, **Parquet**, RCFile, RegexSerDe, SequenceFile, **TextFile**, and **TSV**. Redshift Spectrum **automatically scales query compute** capacity based on the data being retrieved, so queries against Amazon S3 run fast, regardless of data set size.

### Cross-Region Snapshots Copy

You can configure Amazon Redshift to copy snapshots for a cluster to another region. To configure cross-region snapshot copy, you need to enable this copy feature for each cluster and configure where to copy snapshots and how long to keep copied automated snapshots in the destination region. When a cross-region copy is enabled for a cluster, all new manual and automatic snapshots are copied to the specified region.

## AWS WAF

AWS WAF is tightly integrated with Amazon CloudFront, the Application Load Balancer (ALB), Amazon API Gateway, and AWS AppSync. Blocked requests are stopped before they reach your web servers.

### AWS WAF web ACL

There are two types of rules in creating your own web ACL rule: regular and rate-based rules. You need to select the latter to add a rate limit to your web ACL. After creating the web ACL, you can associate it with ALB.

## ⭐️Cloud Front

### Signed URLs vs Signed Cookies

...

<!-- ![https://media.tutorialsdojo.com/amazon-cloud-front-signed-URL-signed-Cookies.png](https://media.tutorialsdojo.com/amazon-cloud-front-signed-URL-signed-Cookies.png) -->

**Signed URLs:**

– You want to use an RTMP distribution. Signed cookies aren’t supported for RTMP distributions.

– You want to restrict access to individual files, for example, an installation download for your application.

– Your users are using a client (for example, a custom HTTP client) that doesn’t support cookies.

**Signed Cookies:**

– You want to provide access to multiple restricted files, for example, all of the files for a video in HLS format or all of the files in the subscribers’ area of a website.

– You don’t want to change your current URLs.

### Origin access identity (OAI)

- Restricts access to the Amazon S3 bucket so that it's not publicly accessible
- Makes sure that viewers (users) can access the content in the bucket only through the specified CloudFront distribution—that is, prevents them from accessing the content directly from the bucket, or through an unintended CloudFront distribution

### Match Viewer as its Origin Protocol Policy

Match Viewer is an Origin Protocol Policy that configures CloudFront to communicate with your origin using HTTP or HTTPS, depending on the protocol of the viewer request.

### Field-Level Encryption

Field-Level Encryption only allows you to securely upload user-submitted sensitive information to your web servers.

### CloudFront Functions

With CloudFront Functions in Amazon CloudFront, you can write lightweight functions in JavaScript for high-scale, latency-sensitive CDN customizations.

### Origin Shield

CloudFront Origin Shield is an additional layer in the CloudFront caching infrastructure that helps to minimize your origin’s load, improve its availability, and reduce its operating costs.

- Better cache hit ratio
- Reduced origin load
- Better network performance

## ⭐️CloudWatch

### CloudWatch agent

To **collect logs from your Amazon EC2 instances and on-premises servers** into CloudWatch Logs, AWS offers both a new unified CloudWatch agent, and an older CloudWatch Logs agent. It is recommended to use the unified CloudWatch agent which has the following advantages:

- You can collect both logs and advanced metrics with the installation and configuration of just one agent.
- The unified agent enables the collection of logs from servers running Windows Server.
- If you are using the agent to collect CloudWatch metrics, the unified agent also enables the collection of additional system metrics, for in-guest visibility.
- The unified agent provides better performance.

### CloudWatch Logs Insights

CloudWatch Logs Insights enables you to interactively **search and analyze your log data in Amazon CloudWatch Logs**. You can perform queries to help you quickly and effectively respond to operational issues. If an issue occurs, you can use CloudWatch Logs Insights to identify potential causes and validate deployed fixes.

### Custom Metrics

You need to prepare a custom metric using CloudWatch Monitoring Scripts which is written in Perl. You can also install CloudWatch Agent to collect more system-level metrics from Amazon EC2 instances. Here's the list of custom metrics that you can set up:

- Memory utilization
- Disk swap utilization
- Disk space utilization
- Page file utilization
- Log collection

## ⭐️DynamoDB

...

### DynamoDB Streams

<!-- ![Untitled](AWS%20Cert%20Renewal%207761b8a32f1444b6b994a7dadeb3fd71/Untitled%208.png) -->

Captures a time-ordered sequence of **item-level modifications** in any DynamoDB table and stores this information in a log for up to 24 hours. Applications can access this log and view the **data items as they appeared before and after they were modified**, in near-real-time.
By setting the Lambda function as the trigger, you can configure DynamoDB streams to let AWS Lambda run your code when an item is inserted into the table.

### Amazon DynamoDB Accelerator (DAX)

Amazon DynamoDB Accelerator (DAX) is a fully managed, highly available, **in-memory cache for Amazon DynamoDB** that delivers up to a 10 times performance improvement—from milliseconds to microseconds—even at millions of requests per second.

### DynamoDB Transactions

A way for you to group a series of operations into a single transaction. This is desirable when you have applications that require an ACID-compliant database such as those that process financial transactions.

### DynamoDB on-demand backups

DynamoDB on-demand backups are **available at no additional cost** beyond the normal pricing that’s associated with backup storage size. DynamoDB on-demand **backups cannot be copied to a different account or Region**. To create backup copies across AWS accounts and Regions and for other advanced features, you should use AWS Backup.

### Notes

- There may be questions about DynamoDB performance (partitions, keys, etc.)

## ⭐️SQS

The messages in the SQS queue will continue to exist even after the EC2 instance has processed it, until you delete that message. You have to ensure that you delete the message after processing to prevent the message from being received and processed again once the **visibility timeout expires**.

**Visibility timeout isn't a guarantee against receiving a message twice**. To avoid duplicate SQS messages, it is better to **design your applications to be idempotent** (they should not be affected adversely when processing the same message more than once).

You **cannot** set a priority to individual items in the SQS queue.

SQS does **not** guarantee that no duplicates will be sent.

It is **not** suitable for scenarios where you need to process the data based on the order they were received.

SQS is just a standard queue and **not a FIFO (First-In-First-Out) queue.**

**Retention Period** simply specifies if the **Amazon SQS should delete the messages that have been in a queue for a certain period of time**.

### SQS FIFO Queues

**Amazon SQS FIFO (First-In-First-Out) Queues** have all the capabilities of the standard queue with additional capabilities designed to enhance messaging between applications when the **order of operations and events is critical** or where **duplicates can't be tolerated.**

<!-- ![Untitled](AWS%20Cert%20Renewal%207761b8a32f1444b6b994a7dadeb3fd71/Untitled%209.png) -->

### Differences between long and short polling

Amazon SQS uses **short polling by default**, querying only a subset of the servers (based on a weighted random distribution) to determine whether any messages are available for inclusion in the response. **Short polling works for scenarios that require higher throughput**. However, you can also configure the queue to use Long polling instead, to reduce cost.

The **ReceiveMessageWaitTimeSeconds is the queue attribute that determines whether you are using Short or Long polling**. By default, its value is **zero which means it is using Short polling**. If it is set to a value **greater than zero, then it is Long polling**.

### Dead-letter queues (DLQ)

Amazon SQS supports dead-letter queues (DLQ), which other queues (source queues) can target for messages that can't be processed (consumed) successfully. Dead-letter queues are useful for debugging your application or messaging system because they let you isolate unconsumed messages to determine why their processing doesn't succeed.

## Amazon MQ

Amazon MQ is a managed message broker service for Apache ActiveMQ and RabbitMQ that streamlines setup, operation, and management of message brokers on AWS.

### ⭐️SNS (Amazon Simple Notification Service)

**Pub-sub** messaging service in AWS.

SNS **might not** be capable of handling such a large volume of messages being received and sent at a time.

It does **not** also guarantee that the data will be transmitted in the same order they were received.

## AWS Key Management Service (AWS KMS)

It’s like Azure KeyVault.

Lot’s of question about this crap. May as well study some cheat sheets

## ⭐️AWS Storage Gateway

The gateway provides access to objects in S3 as files or file share mount points.

AWS Storage Gateway supports **local caching** without any development overhead, making it suitable for **low-latency** applications.

## AWS Glue

**AWS Glue** is a fully managed **ETL** (extract, transform, and load) AWS service. One of its key abilities is to analyze and categorize data. You can use **AWS Glue crawlers** to automatically infer database and table schema from your data in Amazon S3 and store the associated metadata in the **AWS Glue Data Catalog**.

## AWS Athena

**Athena** uses the **AWS Glue Data Catalog** to store and retrieve table metadata for the Amazon S3 data in your AWS account. The table metadata lets the **Athena query engine** know how to find, read, and process the data that you want to query.

## Amazon QuickSight

You can then visualize your **Athena SQL queries** in **Amazon QuickSight**, which lets you easily create and publish **interactive BI dashboards** by creating data sets.

## Amazon Quantum Ledger Database (Amazon QLDB)

Amazon Quantum Ledger Database (Amazon QLDB) is a fully managed **ledger database** that provides a transparent, immutable, and cryptographically verifiable transaction log owned by a central trusted authority. Amazon QLDB can be used to track every application data change and maintains a complete and verifiable history of changes over time.

## Amazon Neptune

fully-managed graph database service

## Amazon Timestream

fully managed **time-series database** service for **IoT** and **operational applications** that makes it easy to store and analyze trillions of events per day at 1/10th the cost of relational databases

## Amazon Keyspaces

Keypsaces is a serverless managed database service that can help migrate existing enterprise-scale Cassandra workloads and transactions.

## ⭐️CloudTrail

AWS CloudTrail is a service that enables governance, compliance, operational auditing, and risk auditing of your AWS account. With CloudTrail, you can log, continuously monitor, and retain account activity related to actions across your AWS infrastructure.

By default, CloudTrail **event log files are encrypted** using Amazon S3 server-side encryption (SSE). You can also choose to encrypt your log files with an AWS Key Management Service (AWS KMS) key. You can store your log files in your bucket for as long as you want. You can also define Amazon S3 lifecycle rules to archive or delete log files automatically. If you want notifications about log file delivery and validation, you can set up Amazon SNS notifications.

### CloudTrail log file integrity validation

The **CloudTrail log file integrity validation** process also lets you know if a log file has been deleted or changed, or **assert positively that** no log files were delivered to your account during a given period of time. The **digest files** are delivered to the same Amazon S3 bucket associated with your trail as your CloudTrail log files.

### CloudTrail Processing Library

The CloudTrail Processing Library is just a Java library that simplifies the processing of CloudTrail logs.

### CloudTrail Insights Events

Feature that allows you to detect unusual write API activities in your account.

### CloudTrails vs CloudWatch

**CloudWatch** focuses on the activity of AWS services and resources, reporting on their health and performance. On the other hand, **CloudTrail** is a log of all actions that have taken place inside your AWS environment.

### Management Events

Management Events provide visibility into **management operations** that are performed on resources in your AWS account. These are also known as control plane operations. Management events can also include non-API events that occur in your account.

### Data Events

Data Events, on the other hand, provide visibility into the **resource operations** performed on or within a resource. These are also known as data plane operations. It allows granular control of data event logging with advanced event selectors. You can currently log data events on different resource types such as Amazon S3 object-level API activity (**e.g. GetObject, DeleteObject, and PutObject** API operations), AWS Lambda function execution activity (the Invoke API), DynamoDB Item actions, and many more.

## ⭐️AWS Lambda

It can handle a sudden burst of traffic within seconds.

You can invoke an AWS Lambda function from an Amazon Aurora MySQL-Compatible Edition DB cluster with a native function or a stored procedure.

The **default timeout is 3 seconds**, and the **maximum execution duration per request in AWS Lambda is 900 seconds, which is equivalent to 15 minutes.**

AWS Lambda limits the **total concurrent executions** across all functions within a given region to **1000**. If that limit is exceeded, the function will be **throttled** but not terminated,

### resource-based policy

...

### Execution Role

Execution roles grant Lambda functions **access to other AWS services**.

### Environment Variables

**Lambda encrypts the environment variables** in your function by default, the sensitive information would still be visible to other users who have access to the Lambda console. This is because **Lambda uses a default KMS key to encrypt the variables, which is usually accessible by other users**.

### Lambda@Edge

Lambda@Edge runs your code in **response to events generated by the Amazon CloudFront** content delivery network (CDN). Just upload your code to AWS Lambda, which takes care of everything required to run and scale your code with high availability at an AWS location **closest to your end user**.

## ⭐️AWS API Gateway

### Throttling

Amazon API Gateway provides throttling at multiple levels including global and by service call. Throttling limits can be set for standard rates and bursts.

### Caching

You can add caching to API calls by provisioning an Amazon API Gateway cache and specifying its size in gigabytes. The cache is provisioned for a specific stage of your APIs. This improves performance and reduces the traffic sent to your back end.

## AWS Elastic Beanstalk

🆕 Elastic Beanstalk supports the deployment of web applications from Docker containers.

Application files are stored in S3. The server log files can also optionally be stored in S3 or in CloudWatch Logs.

## Amazon Inspector

Amazon Inspector is a **vulnerability management service** that **continuously scans** your AWS workloads for vulnerabilities. Amazon Inspector automatically discovers and scans **Amazon EC2 instances** and **container images** residing in Amazon Elastic Container Registry (Amazon ECR) for **software vulnerabilities** and **unintended network exposure**. Amazon Inspector publishes findings to **Amazon EventBridge** as finding events.

## EventBridge

Amazon EventBridge is a serverless event bus service that you can use to **connect your applications with data from a variety of sources**.

**Serverless event bus service** that can route findings data to targets such as **AWS Lambda functions** and **Amazon Simple Notification Service (Amazon SNS) topics**.

## Amazon Macie

Amazon Macie uses machine learning and pattern matching to **discover sensitive data on your AWS resources**, not scanning for software vulnerabilities.

## AWS Trusted Advisor

AWS Trusted Advisor is an online tool that provides you with real-time guidance to help you provision your resources following AWS best practices. It inspects your AWS environment and makes recommendations for saving money, improving system performance and reliability, or closing security gaps.

Trusted Advisor **provides security recommendations** based on industry best practices, however, it can’t scan for software vulnerabilities inside Amazon EC2 instances.

AWS Trusted Advisor **cost optimization checks for underutilized resources**. It doesn’t provide recommendations for resources that are overutilized like in this scenario.

**Cost Optimization** – recommendations that can potentially save you money by highlighting unused resources and opportunities to reduce your bill.

**Security** – identification of security settings that could make your AWS solution less secure.

**Fault Tolerance** – recommendations that help increase the resiliency of your AWS solution by highlighting redundancy shortfalls, current service limits, and over-utilized resources.

**Performance** – recommendations that can help to improve the speed and responsiveness of your applications.

**Service Limits** – recommendations that will tell you when service usage is more than 80% of the service limit.

## Amazon GuardDuty

**Threat detection service** that continuously monitors your AWS workloads for malicious activity.

### GuardDuty vs Inspector

...

## Amazon Managed Service for Prometheus

Serverless, Prometheus-compatible monitoring service for container metrics that makes it easier to securely monitor container environments at scale.

## Amazon Managed Grafana

Fully managed and secure data visualization service that you can use to instantly query, correlate, and visualize operational metrics, logs, and traces from multiple sources.

## AWS Application Discovery Service

Helps you plan your migration to the AWS cloud by **collecting usage and configuration data about your on-premises servers**. Application Discovery Service is integrated with AWS Migration Hub, which simplifies your migration tracking as it aggregates your migration status information into a single console.

## AWS Migration Hub (Migration Hub)

You can view the discovered servers, group them into applications, and then track the migration status of each application from the Migration Hub console in your home region. Migration Hub gives you the choice to start migrating right away and group servers while the migration is underway or to first discover servers and then group them into applications.

## AWS DataSync

AWS DataSync is designed to facilitate data transfer from on-premises to AWS storage systems.

Q: DataSync vs Storage Gateway? 

[AWS Storage Gateway vs DataSync](https://www.youtube.com/watch?v=tmfe1rO-AUs)

<!-- ![Untitled](AWS%20Cert%20Renewal%207761b8a32f1444b6b994a7dadeb3fd71/Untitled%2010.png) -->

## AWS Application Migration Service

AWS Application Migration Service (MGN) is a highly automated lift-and-shift solution that works by replicating your on-premises (physical or virtual) and/or cloud servers (referred to as “source servers”) into your AWS account.

## Migration Hub vs Application Migration Service

...

## AWS Database Migration Service

Migrate your databases to AWS with minimal downtime.

With AWS DMS, you can perform **one-time migrations**, and you can **replicate ongoing changes** to keep sources and targets in sync.

If you want to migrate to a different database engine, you can use the AWS Schema Conversion Tool (AWS SCT) to **translate your database schema to the new platform.** You then use AWS DMS to migrate the data.

Change data capture (CDC) → continuous data replication.

You can migrate data to Amazon S3 using AWS DMS from any of the supported database sources. When using Amazon S3 as a target in an AWS DMS task, both full load and change data capture (CDC) data is written to comma-separated value (.csv) format by default.

The comma-separated value (.csv) format is the default storage format for Amazon S3 target objects. For more compact storage and faster queries, you can instead use Apache Parquet (.parquet) as the storage format.

## AWS Compute Optimizer

Recommends optimal AWS resources for your workloads to reduce costs and improve performance by using machine learning to analyze historical utilization metrics:

- Amazon Elastic Compute Cloud (Amazon EC2) instances
- Amazon EC2 Auto Scaling groups
- Amazon Elastic Block Store (Amazon EBS) volumes
- AWS Lambda functions

After you opt-in, Compute Optimizer begins analyzing the specifications and the utilization metrics of your resources from Amazon CloudWatch for the last 14 days.

## AWS Cost Explorer

Visualize, understand, and manage your AWS costs and usage over time.

## CIDR Notation

The /32 denotes one IP address and the /0 refers to the entire network.

## AWS Transit Gateway

Transit Gateway simply connects your VPC and on-premises networks through a central hub.
Q: WTF is a central hub?

## AWS Direct Connect

Dedicated network connection from your premises to AWS.

## AWS VPN CloudHub

Cloud VPN service.

## Security Assertion Markup Language (SAML)

AWS supports identity federation with SAML 2.0, an open standard that many identity providers (IdPs) use. This feature enables federated single sign-on (SSO)

### Microsoft Active Directory Federation Service (AD FS)

IdP that supports SAML 2.0.

### Web Identity Federation

Let users sign in via a well-known external identity provider (IdP), such as Login with Amazon, Facebook, Google. 

## Amazon FSx

Launch, run, and scale feature-rich and highly-performant file systems with just a few clicks

### Amazon FSx for Windows File Server

Fully managed Microsoft Windows file servers, backed by a fully native Windows file system. Accessible over the Service Message Block (SMB) protocol.

### Amazon FSx For Lustre

Amazon FSx For Lustre is a high-performance file system for fast processing of workloads. Lustre is a popular open-source parallel file system which stores data across multiple network file servers to maximize performance and reduce bottlenecks.

Access and process Amazon S3 data from a high-performance file system by **linking your file systems to S3 buckets**.

<!-- ![Untitled](AWS%20Cert%20Renewal%207761b8a32f1444b6b994a7dadeb3fd71/Untitled%2011.png) -->

## ⭐️Amazon EFS

Amazon Elastic File System accessible via Network File System (NFS)

## ⭐️Amazon EBS

Elastic Block System is primarily used as block storage for EC2 instances and not as a shared file system.

EBS volumes support live configuration changes while in production which means that you can modify the volume type, volume size, and IOPS capacity without service interruptions.

An EBS volume is off-instance storage that can persist independently from the life of an instance.

Amazon EBS provides three volume types to best meet the needs of your workloads: **General Purpose (SSD)**, **Provisioned IOPS (SSD)**, and **Magnetic**.

When you create an encrypted EBS volume and attach it to a supported instance type, the following types of data are **encrypted**:

- Data at rest inside the volume
- All data moving between the volume and the instance
- All snapshots created from the volume
- All volumes created from those snapshots

### Amazon Data Lifecycle Manager

You can use Amazon Data Lifecycle Manager to automate the creation, retention, and deletion of EBS snapshots and EBS-backed AMIs. When you automate snapshot and AMI management, it helps you to:

- Protect valuable data by enforcing a regular backup schedule.
- Create standardized AMIs that can be refreshed at regular intervals.
- Retain backups as required by auditors or internal compliance.
- Reduce storage costs by deleting outdated backups.
- Create disaster recovery backup policies that back up data to isolated accounts.

## AWS Organizations

<!-- ![Untitled](AWS%20Cert%20Renewal%207761b8a32f1444b6b994a7dadeb3fd71/Untitled%2012.png) -->

Account management service that lets you consolidate multiple AWS accounts into an organization that you create and centrally manage.

**IAM cross-account access**
You can use an IAM role to delegate access to resources that are in different AWS accounts that you own. You share resources in one account with users in a different account. By setting up cross-account access in this way, you don't need to create individual IAM users in each account. In addition, users don't have to sign out of one account and sign into another in order to access resources that are in different AWS accounts.

**AWS Consolidated Billing**
With consolidated billing, you can see a combined view of AWS charges incurred by all of your accounts. You can also get a cost report for each member account that is associated with your master account. Consolidated billing is offered at no additional charge.

## AWS Resource Access Manager (RAM)

Service that enables you to easily and securely share AWS resources with any AWS account or within your AWS Organization. You can share AWS Transit Gateways, Subnets, AWS License Manager configurations, and Amazon Route 53 Resolver rules resources with RAM.

## AWS Artifact

AWS Artifact is your go-to, central resource for **compliance-related information** that matters to you.

## ⭐️AWS Config

AWS Config is a service that enables you to **assess, audit, and evaluate the configurations of your AWS resources**. Config continuously monitors and records your AWS resource configurations and allows you to **automate the evaluation of recorded configurations against desired configurations**. With Config, you can **review changes** in configurations and relationships between AWS resources, dive into **detailed resource configuration histories**, and determ**ine your overall compliance against the configurations specified in your internal guidelines**. This enables you to **simplify compliance auditing, security analysis, change management, and operational troubleshooting**.

## Amazon EMR (Amazon Elastic MapReduce)

A managed cluster platform that simplifies running big data frameworks, such as Apache Hadoop and Apache Spark, on AWS to process and analyze vast amounts of data.

## AWS Control Tower Landing Zone

...

## Amazon Simple Workflow Service (SWF)

Amazon SWF is a web service that makes it easy to coordinate work across distributed application components.

It ensures that a **task is never duplicated and is assigned only once**. Thus, even though you may have multiple workers for a particular activity type (or a number of instances of a decider), **Amazon SWF will give a specific task to only one worker** (or one decider instance). 

Additionally, Amazon SWF keeps **at most one decision task outstanding at a time for workflow execution**. Thus, you can run multiple decider instances without worrying about two instances operating on the same execution simultaneously. These facilities enable you to coordinate your workflow without **worrying about duplicate, lost, or conflicting tasks**.

## AWS Network Firewall

Stateful, managed network firewall and intrusion detection and prevention service for your virtual private cloud (VPC)

## AWS Serverless Application Model (SAM)

The AWS Serverless Application Model (SAM) is an **open-source framework for building serverless applications**. It provides shorthand syntax to express functions, APIs, databases, and event source mappings. With just a few lines per resource, you can define the application you want and model it using YAML.

## AWS Backup

AWS Backup is a fully managed service that enables you to **centralize and automate data protection across on-premises and AWS services**. Together with AWS Organizations, AWS Backup allows you to **centrally deploy data protection (backup) policies** to configure, manage, and govern your backup activity across your organization’s AWS accounts and resources. AWS Backup also **enables you to audit and report on the compliance of your data protection policies with AWS Backup Audit Manager**.

### Backup Plans

A backup plan is a policy expression that defines when and how you want to back up your AWS resources. You assign resources to backup plans, and AWS Backup then automatically backs up and retains backups for those resources according to the backup plan. Example: you can use AWS Backup to create a backup plan with a retention period of 90 days.

## AWS Security Token Service (AWS STS)

Service that you can use to create and provide trusted users with **temporary security credentials** that can control access to your AWS resources. Temporary security credentials work almost identically to the long-term access key credentials that your IAM users can use.

## AWS App Sync

...

## ⭐️Amazon Kinesis Data Streams (KDS)

Massively **scalable and durable real-time data streaming service**. KDS can continuously capture gigabytes of data per second from hundreds of thousands of sources. You can use an AWS Lambda function to process records in Amazon KDS. By default, Lambda invokes your function as soon as records are available in the stream.

The data collected is **available in milliseconds**. Use AWS Lambda to **read records in batches** and invoke your function to process records from the batch.

It provides **ordering of records**, as well as the ability to **read and/or replay records in the same order** to multiple Amazon Kinesis Applications.

By **default**, **records** of a stream in Amazon Kinesis **are accessible for up to 24 hours** from the time they are added to the stream. You can **raise this limit to up to 7 days** by enabling extended data retention.

## ⭐️Kinesis Data Firehose

Amazon Kinesis Data Firehose captures and loads data in near real-time, AWS Lambda can't be set as its destination.

Q: So what’s the fucking difference between Kinesis Data Streams and Kinesis Data Firehose? 

[Amazon Kinesis](https://tutorialsdojo.com/amazon-kinesis/)

## Fault Tolerance vs High Availability

...

## AWS Transit Gateway

AWS Transit Gateway is a service that enables customers to **connect their Amazon Virtual Private Clouds (VPCs) and their on-premises networks** to a single gateway.

## AWS Health

### AWS Personal Health Dashboard

AWS Health provides ongoing visibility into **your resource** performance and the availability of your AWS services and accounts. You can use AWS Health events to learn how service and resource changes might affect your applications running on AWS. AWS Health provides relevant and timely information to help you manage events in progress. AWS Health also helps you be aware of and to prepare for planned activities.

### AWS Service Health Dashboard

AWS Service Health Dashboard shows **public events that may affect several customers in particular regions**. It doesn't show events related to specific EC2 instances on individual AWS accounts. You have to check the events on the AWS Personal Health Dashboard instead.

## AWS Certificate Manager (ACM)

This service manages certificates for enterprise customers who need a **publicly trusted secure web presence using TLS.** You can deploy ACM certificates into **AWS Elastic Load Balancing, Amazon CloudFront, Amazon API Gateway, and other integrated services**. The most common application of this kind is a secure public website with significant traffic requirements.

## Amazon Textract

Amazon Textract is a machine learning (ML) service that automatically extracts text, handwriting, and data from scanned documents.

## Amazon Comprehend

Amazon Comprehend uses machine learning to **help you uncover the insights and relationships in your unstructured data**. The service identifies the language of the text; extracts key phrases, places, people, brands, or events; understands how positive or negative the text is; analyzes text using tokenization and parts of speech, and automatically organizes a collection of text files by topic.

## Amazon Comprehend Medical

Amazon Comprehend Medical uses advanced machine learning models to accurately and quickly **identify medical information** such as medical conditions and medication and determine their relationship to each other, for instance, medication and dosage.

Comprehend Medical is HIPAA-eligible and can quickly identify protected health information (PHI), such as name, age, and medical record number, you can also use it to create applications that securely process, maintain, and transmit PHI.

## AWS Budgets

Set custom budgets that **alert you when your costs or usage exceed** (or are forecasted to exceed) your budgeted amount. You can also use AWS Budgets to set **reservation utilization or coverage targets and receive alerts when your utilization drops** below the threshold you define.

## AWS AppSync

AWS AppSync is a **serverless GraphQL** and **Pub/Sub API** service that simplifies building modern web and mobile applications. It provides a robust, scalable GraphQL interface for application developers to **combine data from multiple sources**, including Amazon DynamoDB, AWS Lambda, and HTTP APIs.

## AWS ParallelCluster

AWS-supported open-source cluster management tool that makes it easy for you to deploy and manage High-Performance Computing (HPC) clusters on AWS.

## SimpleDB

SimpleDB is also a highly available and scalable NoSQL database, it has a limit on the request capacity or storage size for a given table, unlike DynamoDB.

## AWS Systems Manager

[https://youtu.be/KVFKyMAHxqY](https://youtu.be/KVFKyMAHxqY)

### AWS Systems Manager Run Command

Lets you remotely and securely manage the configuration of your managed instances.

## AWS Proton

...
