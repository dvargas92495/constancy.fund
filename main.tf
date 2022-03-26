terraform {
  backend "remote" {
    hostname = "app.terraform.io"
    organization = "VargasArts"
    workspaces {
      prefix = "crowdinvestin-me"
    }
  }
  required_providers {
    github = {
      source = "integrations/github"
      version = "4.2.0"
    }
    aws = {
      source = "hashicorp/aws"
      version = "3.74.2"
    }
  }
}

variable "aws_access_token" {
  type = string
}

variable "aws_secret_token" {
  type = string
}

variable "github_token" {
  type = string
}

variable "secret" {
  type = string
}

variable "clerk_api_key" {
    type = string
}

variable "mysql_password" {
  type = string
}

variable "stripe_public" {
  type = string
}

variable "stripe_secret" {
  type = string
}

variable "eversign_api_key" {
  type = string
}

variable "staging_clerk_api_key" {
    type = string
}

variable "staging_mysql_password" {
  type = string
}

variable "convertkit_api_key" {
  type = string
}

provider "aws" {
  region = "us-east-1"
  access_key = var.aws_access_token
  secret_key = var.aws_secret_token
}

provider "github" {
  owner = "dvargas92495"
  token = var.github_token
}

module "aws_static_site" {
  source  = "dvargas92495/static-site/aws"
  version = "3.4.0"

  domain = "constancy.fund"
  secret = var.secret
  origin_timeout = 20
  tags = {
      Application = "constancy-fund"
  }

  providers = {
    aws.us-east-1 = aws
  }
}

module "aws-serverless-backend" {
  source  = "dvargas92495/serverless-backend/aws"
  version = "2.4.1"

  api_name = "constancy-fund"
  sizes = {
    "create-contract-pdf": 5120
  }
}

module "aws_static_site_staging" {
  source  = "dvargas92495/static-site/aws"
  version = "3.5.2"

  domain = "staging.constancy.fund"
  secret = var.secret
  origin_timeout = 20
  origin_memory_size = 5120
  tags = {
      Application = "constancy-fund"
  }

  providers = {
    aws.us-east-1 = aws
  }
}

module "aws-serverless-backend_staging" {
  source  = "dvargas92495/serverless-backend/aws"
  version = "2.4.1"

  api_name = "staging-constancy-fund"
  sizes = {
    "create-contract-pdf": 5120
  }
}

module "aws_email" {
  source  = "dvargas92495/email/aws"
  version = "2.0.12"

  domain = "constancy.fund"
  zone_id = module.aws_static_site.route53_zone_id
}

module "aws_email_staging" {
  source  = "dvargas92495/email/aws"
  version = "2.0.12"

  domain = "staging.constancy.fund"
  zone_id = module.aws_static_site_staging.route53_zone_id
}

module "aws_clerk" {
  source   = "dvargas92495/clerk/aws"
  version  = "1.0.4"

  zone_id  = module.aws_static_site.route53_zone_id
  clerk_id = "v9c58hxcw6jy"
}

resource "github_actions_secret" "deploy_aws_access_key" {
  repository       = "constancy.fund"
  secret_name      = "DEPLOY_AWS_ACCESS_KEY"
  plaintext_value  = module.aws_static_site.deploy-id
}

resource "github_actions_secret" "deploy_aws_access_secret" {
  repository       = "constancy.fund"
  secret_name      = "DEPLOY_AWS_ACCESS_SECRET"
  plaintext_value  = module.aws_static_site.deploy-secret
}

resource "github_actions_secret" "lambda_aws_access_key" {
  repository       = "constancy.fund"
  secret_name      = "LAMBDA_AWS_ACCESS_KEY"
  plaintext_value  = module.aws-serverless-backend.access_key
}

resource "github_actions_secret" "lambda_aws_access_secret" {
  repository       = "constancy.fund"
  secret_name      = "LAMBDA_AWS_ACCESS_SECRET"
  plaintext_value  = module.aws-serverless-backend.secret_key
}

resource "github_actions_secret" "mysql_password" {
  repository       = "constancy.fund"
  secret_name      = "MYSQL_PASSWORD"
  plaintext_value  = var.mysql_password
}

resource "github_actions_secret" "clerk_api_key" {
  repository       = "constancy.fund"
  secret_name      = "CLERK_API_KEY"
  plaintext_value  = var.clerk_api_key
}

resource "github_actions_secret" "stripe_public" {
  repository       = "constancy.fund"
  secret_name      = "STRIPE_PUBLIC_KEY"
  plaintext_value  = var.stripe_public
}

resource "github_actions_secret" "stripe_secret" {
  repository       = "constancy.fund"
  secret_name      = "STRIPE_SECRET_KEY"
  plaintext_value  = var.stripe_secret
}

resource "github_actions_secret" "eversign_api_key" {
  repository       = "constancy.fund"
  secret_name      = "EVERSIGN_API_KEY"
  plaintext_value  = var.eversign_api_key
}

resource "github_actions_secret" "stagingd_aws_access_key" {
  repository       = "constancy.fund"
  secret_name      = "STAGINGD_AWS_ACCESS_KEY"
  plaintext_value  = module.aws_static_site_staging.deploy-id
}

resource "github_actions_secret" "stagingd_aws_access_secret" {
  repository       = "constancy.fund"
  secret_name      = "STAGINGD_AWS_ACCESS_SECRET"
  plaintext_value  = module.aws_static_site_staging.deploy-secret
}

resource "github_actions_secret" "stagingl_aws_access_key" {
  repository       = "constancy.fund"
  secret_name      = "STAGINGL_AWS_ACCESS_KEY"
  plaintext_value  = module.aws-serverless-backend_staging.access_key
}

resource "github_actions_secret" "stagingl_aws_access_secret" {
  repository       = "constancy.fund"
  secret_name      = "STAGINGL_AWS_ACCESS_SECRET"
  plaintext_value  = module.aws-serverless-backend_staging.secret_key
}

resource "github_actions_secret" "staging_clerk_api_key" {
  repository       = "constancy.fund"
  secret_name      = "STAGING_CLERK_API_KEY"
  plaintext_value  = var.staging_clerk_api_key
}

resource "github_actions_secret" "staging_mysql_password" {
  repository       = "constancy.fund"
  secret_name      = "STAGING_MYSQL_PASSWORD"
  plaintext_value  = var.staging_mysql_password
}

resource "github_actions_secret" "cloudfront_distribution_id" {
  repository       = "constancy.fund"
  secret_name      = "CLOUDFRONT_DISTRIBUTION_ID"
  plaintext_value  = module.aws_static_site.cloudfront_distribution_id
}

resource "github_actions_secret" "staging_cloudfront_distribution_id" {
  repository       = "constancy.fund"
  secret_name      = "STAGING_CLOUDFRONT_DISTRIBUTION_ID"
  plaintext_value  = module.aws_static_site_staging.cloudfront_distribution_id
}

resource "github_actions_secret" "convertkit_api_key" {
  repository       = "constancy.fund"
  secret_name      = "CONVERTKIT_API_KEY"
  plaintext_value  = var.convertkit_api_key
}
