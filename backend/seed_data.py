import json
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
from models import Question, StudyGuide, Flashcard

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

def seed_questions():
    """Seed the database with sample AWS Professional Architect questions"""
    db = SessionLocal()
    
    # Check if questions already exist
    if db.query(Question).count() > 0:
        print("Questions already exist, skipping seeding.")
        db.close()
        return
    
    sample_questions = [
        # Design Resilient Architectures
        {
            "question_text": "A company is designing a multi-tier web application on AWS. The application must be highly available across multiple Availability Zones. The database tier should automatically failover in case of primary database failure. Which combination of AWS services best meets these requirements?",
            "option_a": "Application Load Balancer, Auto Scaling Group, Amazon RDS Multi-AZ",
            "option_b": "Network Load Balancer, EC2 instances, Amazon DynamoDB",
            "option_c": "Classic Load Balancer, Auto Scaling Group, Amazon RDS Read Replicas",
            "option_d": "Application Load Balancer, EC2 instances, Amazon Aurora Global Database",
            "correct_answer": "A",
            "explanation": "Application Load Balancer distributes traffic across multiple AZs, Auto Scaling Group ensures high availability of compute resources, and RDS Multi-AZ provides automatic failover for the database tier.",
            "domain": "Design Resilient Architectures",
            "difficulty": "Medium",
            "aws_service": "RDS",
            "tags": json.dumps(["high-availability", "multi-az", "database-failover"])
        },
        {
            "question_text": "A financial services company needs to implement a disaster recovery solution for their critical workloads. They require an RTO of 4 hours and RPO of 1 hour. The solution should be cost-effective. Which DR strategy is most appropriate?",
            "option_a": "Backup and Restore",
            "option_b": "Pilot Light",
            "option_c": "Warm Standby",
            "option_d": "Multi-site Active-Active",
            "correct_answer": "B",
            "explanation": "Pilot Light strategy meets the RTO/RPO requirements while being cost-effective. It maintains critical infrastructure running in a secondary region with the ability to scale up quickly.",
            "domain": "Design Resilient Architectures",
            "difficulty": "Hard",
            "aws_service": "Multiple",
            "tags": json.dumps(["disaster-recovery", "pilot-light", "rto-rpo"])
        },
        
        # Design High-Performing Architectures
        {
            "question_text": "A media streaming company experiences variable traffic patterns with peak usage during evening hours. The application currently uses fixed-size EC2 instances. Which solution would optimize performance and cost?",
            "option_a": "Use larger EC2 instances to handle peak traffic",
            "option_b": "Implement Auto Scaling with predictive scaling and CloudFront CDN",
            "option_c": "Use Spot Instances for all compute resources",
            "option_d": "Migrate to AWS Lambda for all compute needs",
            "correct_answer": "B",
            "explanation": "Auto Scaling with predictive scaling handles variable traffic patterns efficiently, while CloudFront CDN improves performance by caching content closer to users.",
            "domain": "Design High-Performing Architectures",
            "difficulty": "Medium",
            "aws_service": "Auto Scaling",
            "tags": json.dumps(["auto-scaling", "cloudfront", "performance-optimization"])
        },
        {
            "question_text": "A data analytics workload requires processing large datasets with sub-second query response times. The data is accessed frequently and grows by 10TB monthly. Which storage solution provides the best performance?",
            "option_a": "Amazon S3 Standard with S3 Transfer Acceleration",
            "option_b": "Amazon EFS with General Purpose performance mode",
            "option_c": "Amazon EBS with Provisioned IOPS SSD (io2)",
            "option_d": "Amazon FSx for Lustre with scratch file system",
            "correct_answer": "D",
            "explanation": "FSx for Lustre provides the highest performance for data analytics workloads requiring sub-second response times and can handle the high throughput requirements.",
            "domain": "Design High-Performing Architectures",
            "difficulty": "Hard",
            "aws_service": "FSx",
            "tags": json.dumps(["high-performance", "storage", "analytics"])
        },
        
        # Design Secure Applications and Architectures
        {
            "question_text": "A healthcare organization needs to ensure that sensitive patient data stored in S3 is encrypted at rest and in transit. They also need to maintain control over encryption keys. Which combination of services meets these requirements?",
            "option_a": "S3 server-side encryption with Amazon S3 managed keys (SSE-S3)",
            "option_b": "S3 server-side encryption with AWS KMS managed keys (SSE-KMS) and AWS CloudHSM",
            "option_c": "S3 server-side encryption with customer-provided keys (SSE-C)",
            "option_d": "Client-side encryption with AWS KMS and S3 bucket policy for HTTPS",
            "correct_answer": "D",
            "explanation": "Client-side encryption with AWS KMS ensures data is encrypted before transmission, and S3 bucket policy requiring HTTPS ensures encryption in transit. This gives the organization full control over encryption keys.",
            "domain": "Design Secure Applications and Architectures",
            "difficulty": "Hard",
            "aws_service": "S3",
            "tags": json.dumps(["encryption", "security", "compliance", "healthcare"])
        },
        {
            "question_text": "A company wants to implement defense-in-depth security for their web application. The application runs on EC2 instances behind an Application Load Balancer. Which security measures should be implemented?",
            "option_a": "WAF on ALB, Security Groups, and NACLs",
            "option_b": "Only Security Groups with restrictive rules",
            "option_c": "WAF on ALB, Security Groups, NACLs, and AWS Shield Standard",
            "option_d": "WAF on ALB, Security Groups, NACLs, AWS Shield Advanced, and GuardDuty",
            "correct_answer": "D",
            "explanation": "Defense-in-depth requires multiple layers of security. WAF protects against web attacks, Security Groups and NACLs provide network-level security, Shield Advanced provides DDoS protection, and GuardDuty provides threat detection.",
            "domain": "Design Secure Applications and Architectures",
            "difficulty": "Medium",
            "aws_service": "WAF",
            "tags": json.dumps(["defense-in-depth", "security-layers", "web-security"])
        },
        
        # Design Cost-Optimized Architectures
        {
            "question_text": "A company has a batch processing workload that runs for 4 hours daily during off-peak hours. The workload is not time-critical and can tolerate interruptions. Which EC2 pricing model would be most cost-effective?",
            "option_a": "On-Demand Instances",
            "option_b": "Reserved Instances",
            "option_c": "Spot Instances",
            "option_d": "Dedicated Hosts",
            "correct_answer": "C",
            "explanation": "Spot Instances are most cost-effective for batch processing workloads that can tolerate interruptions. They offer up to 90% cost savings compared to On-Demand pricing.",
            "domain": "Design Cost-Optimized Architectures",
            "difficulty": "Easy",
            "aws_service": "EC2",
            "tags": json.dumps(["cost-optimization", "spot-instances", "batch-processing"])
        },
        {
            "question_text": "A startup is building a new web application and expects variable traffic patterns. They want to minimize costs while maintaining good performance. Which architecture pattern is most appropriate?",
            "option_a": "Static website hosting on S3 with CloudFront",
            "option_b": "Serverless architecture with API Gateway, Lambda, and DynamoDB",
            "option_c": "Auto Scaling EC2 instances with RDS",
            "option_d": "Container-based architecture with ECS and Aurora Serverless",
            "correct_answer": "B",
            "explanation": "Serverless architecture with API Gateway, Lambda, and DynamoDB provides automatic scaling and pay-per-use pricing, making it ideal for variable traffic patterns and cost optimization.",
            "domain": "Design Cost-Optimized Architectures",
            "difficulty": "Medium",
            "aws_service": "Lambda",
            "tags": json.dumps(["serverless", "cost-optimization", "variable-traffic"])
        }
    ]
    
    for question_data in sample_questions:
        question = Question(**question_data)
        db.add(question)
    
    db.commit()
    print(f"Seeded {len(sample_questions)} questions")
    db.close()

def seed_study_guides():
    """Seed the database with sample study guides"""
    db = SessionLocal()
    
    # Check if study guides already exist
    if db.query(StudyGuide).count() > 0:
        print("Study guides already exist, skipping seeding.")
        db.close()
        return
    
    sample_guides = [
        {
            "title": "Amazon EC2 - Elastic Compute Cloud",
            "content": "Amazon EC2 provides scalable computing capacity in the cloud. It eliminates the need to invest in hardware upfront and allows you to develop and deploy applications faster.",
            "domain": "Design High-Performing Architectures",
            "service": "EC2",
            "key_points": json.dumps([
                "Multiple instance types for different use cases",
                "Auto Scaling for dynamic capacity",
                "Spot Instances for cost optimization",
                "Placement groups for network performance",
                "Enhanced networking with SR-IOV"
            ]),
            "use_cases": json.dumps([
                "Web servers and application servers",
                "Batch processing and HPC",
                "Database servers",
                "Game servers",
                "Development and testing"
            ]),
            "best_practices": json.dumps([
                "Right-size instances based on workload",
                "Use Auto Scaling for variable workloads",
                "Implement proper monitoring and alerting",
                "Use appropriate storage types",
                "Implement proper security groups"
            ]),
            "pricing_notes": "Pay-per-use pricing with options for On-Demand, Reserved, and Spot Instances"
        },
        {
            "title": "Amazon RDS - Relational Database Service",
            "content": "Amazon RDS makes it easy to set up, operate, and scale a relational database in the cloud. It provides cost-efficient and resizable capacity.",
            "domain": "Design Resilient Architectures",
            "service": "RDS",
            "key_points": json.dumps([
                "Multi-AZ deployments for high availability",
                "Read replicas for read scaling",
                "Automated backups and snapshots",
                "Multiple database engines supported",
                "Automated software patching"
            ]),
            "use_cases": json.dumps([
                "Web and mobile applications",
                "E-commerce applications",
                "Online games",
                "Data warehousing",
                "Business intelligence"
            ]),
            "best_practices": json.dumps([
                "Use Multi-AZ for production workloads",
                "Implement proper backup strategies",
                "Monitor performance metrics",
                "Use appropriate instance types",
                "Implement proper security configurations"
            ]),
            "pricing_notes": "Pay for what you use with options for Reserved Instances"
        },
        {
            "title": "AWS Lambda - Serverless Computing",
            "content": "AWS Lambda lets you run code without provisioning or managing servers. You pay only for the compute time you consume.",
            "domain": "Design Cost-Optimized Architectures",
            "service": "Lambda",
            "key_points": json.dumps([
                "No server management required",
                "Automatic scaling",
                "Pay-per-request pricing",
                "Integrates with many AWS services",
                "Supports multiple programming languages"
            ]),
            "use_cases": json.dumps([
                "Real-time file processing",
                "Data processing and ETL",
                "IoT backends",
                "Web applications",
                "Mobile backends"
            ]),
            "best_practices": json.dumps([
                "Optimize function memory allocation",
                "Use environment variables for configuration",
                "Implement proper error handling",
                "Keep functions stateless",
                "Use appropriate timeout values"
            ]),
            "pricing_notes": "Pay per request and compute time with generous free tier"
        }
    ]
    
    for guide_data in sample_guides:
        guide = StudyGuide(**guide_data)
        db.add(guide)
    
    db.commit()
    print(f"Seeded {len(sample_guides)} study guides")
    db.close()

def seed_flashcards():
    """Seed the database with sample flashcards"""
    db = SessionLocal()
    
    # Check if flashcards already exist
    if db.query(Flashcard).count() > 0:
        print("Flashcards already exist, skipping seeding.")
        db.close()
        return
    
    sample_flashcards = [
        {
            "front": "What is the maximum number of Availability Zones in a single AWS Region?",
            "back": "There is no fixed maximum, but most regions have 3-6 AZs. AWS can add more AZs to a region over time.",
            "domain": "Design Resilient Architectures",
            "service": "General",
            "difficulty": "Easy",
            "tags": json.dumps(["availability-zones", "regions", "fundamentals"])
        },
        {
            "front": "What is the difference between Amazon S3 Standard and S3 Standard-IA?",
            "back": "S3 Standard-IA (Infrequent Access) has lower storage costs but higher retrieval costs compared to S3 Standard. It's designed for data accessed less frequently.",
            "domain": "Design Cost-Optimized Architectures",
            "service": "S3",
            "difficulty": "Medium",
            "tags": json.dumps(["s3-storage-classes", "cost-optimization"])
        },
        {
            "front": "What is AWS CloudFormation?",
            "back": "AWS CloudFormation is a service that helps you model and set up AWS resources using templates. It allows Infrastructure as Code (IaC).",
            "domain": "Design Resilient Architectures",
            "service": "CloudFormation",
            "difficulty": "Easy",
            "tags": json.dumps(["infrastructure-as-code", "automation"])
        },
        {
            "front": "What is the difference between Security Groups and NACLs?",
            "back": "Security Groups are stateful and operate at the instance level, while NACLs are stateless and operate at the subnet level. Security Groups only allow rules, NACLs allow both allow and deny rules.",
            "domain": "Design Secure Applications and Architectures",
            "service": "VPC",
            "difficulty": "Medium",
            "tags": json.dumps(["security-groups", "nacls", "network-security"])
        },
        {
            "front": "What is Amazon DynamoDB?",
            "back": "Amazon DynamoDB is a fully managed NoSQL database service that provides fast and predictable performance with seamless scalability.",
            "domain": "Design High-Performing Architectures",
            "service": "DynamoDB",
            "difficulty": "Easy",
            "tags": json.dumps(["nosql", "database", "managed-service"])
        }
    ]
    
    for flashcard_data in sample_flashcards:
        flashcard = Flashcard(**flashcard_data)
        db.add(flashcard)
    
    db.commit()
    print(f"Seeded {len(sample_flashcards)} flashcards")
    db.close()

def seed_all():
    """Seed all data"""
    print("Starting database seeding...")
    seed_questions()
    seed_study_guides()
    seed_flashcards()
    print("Database seeding completed!")

if __name__ == "__main__":
    seed_all()