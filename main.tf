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

variable "staging_clerk_api_key" {
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
  version = "3.2.0"

  domain = "crowdinvestin.me"
  secret = var.secret
  tags = {
      Application = "crowdinvestin-me"
  }

  providers = {
    aws.us-east-1 = aws
  }
}

module "aws-serverless-backend" {
  source  = "dvargas92495/serverless-backend/aws"
  version = "2.2.0"

  api_name = "crowdinvestin-me"
}

module "aws_static_site_staging" {
  source  = "dvargas92495/static-site/aws"
  version = "3.2.0"

  domain = "staging.crowdinvestin.me"
  secret = var.secret
  tags = {
      Application = "crowdinvestin-me"
  }

  providers = {
    aws.us-east-1 = aws
  }
}

module "aws-serverless-backend_staging" {
  source  = "dvargas92495/serverless-backend/aws"
  version = "2.2.1"

  api_name = "staging-crowdinvestin-me"
}

module "aws_email" {
  source  = "dvargas92495/email/aws"
  version = "2.0.4"

  domain = "crowdinvestin.me"
  zone_id = module.aws_static_site.route53_zone_id
}

module "aws_email_staging" {
  source  = "dvargas92495/email/aws"
  version = "2.0.4"

  domain = "staging.crowdinvestin.me"
  zone_id = module.aws_static_site_staging.route53_zone_id
}

module "aws_clerk" {
  source   = "dvargas92495/clerk/aws"
  version  = "1.0.4"

  zone_id  = module.aws_static_site.route53_zone_id
  clerk_id = "cs5j97s3jadv"
}

resource "github_actions_secret" "deploy_aws_access_key" {
  repository       = "crowdinvestin.me"
  secret_name      = "DEPLOY_AWS_ACCESS_KEY"
  plaintext_value  = module.aws_static_site.deploy-id
}

resource "github_actions_secret" "deploy_aws_access_secret" {
  repository       = "crowdinvestin.me"
  secret_name      = "DEPLOY_AWS_ACCESS_SECRET"
  plaintext_value  = module.aws_static_site.deploy-secret
}

resource "github_actions_secret" "lambda_aws_access_key" {
  repository       = "crowdinvestin.me"
  secret_name      = "LAMBDA_AWS_ACCESS_KEY"
  plaintext_value  = module.aws-serverless-backend.access_key
}

resource "github_actions_secret" "lambda_aws_access_secret" {
  repository       = "crowdinvestin.me"
  secret_name      = "LAMBDA_AWS_ACCESS_SECRET"
  plaintext_value  = module.aws-serverless-backend.secret_key
}

resource "github_actions_secret" "mysql_password" {
  repository       = "crowdinvestin.me"
  secret_name      = "MYSQL_PASSWORD"
  plaintext_value  = var.mysql_password
}

resource "github_actions_secret" "clerk_api_key" {
  repository       = "crowdinvestin.me"
  secret_name      = "CLERK_API_KEY"
  plaintext_value  = var.clerk_api_key
}

resource "github_actions_secret" "stripe_public" {
  repository       = "crowdinvestin.me"
  secret_name      = "STRIPE_PUBLIC_KEY"
  plaintext_value  = var.stripe_public
}

resource "github_actions_secret" "stripe_secret" {
  repository       = "crowdinvestin.me"
  secret_name      = "STRIPE_SECRET_KEY"
  plaintext_value  = var.stripe_secret
}

resource "github_actions_secret" "stagingd_aws_access_key" {
  repository       = "crowdinvestin.me"
  secret_name      = "STAGINGD_AWS_ACCESS_KEY"
  plaintext_value  = module.aws_static_site_staging.deploy-id
}

resource "github_actions_secret" "stagingd_aws_access_secret" {
  repository       = "crowdinvestin.me"
  secret_name      = "STAGINGD_AWS_ACCESS_SECRET"
  plaintext_value  = module.aws_static_site_staging.deploy-secret
}

resource "github_actions_secret" "stagingl_aws_access_key" {
  repository       = "crowdinvestin.me"
  secret_name      = "STAGINGL_AWS_ACCESS_KEY"
  plaintext_value  = module.aws-serverless-backend_staging.access_key
}

resource "github_actions_secret" "stagingl_aws_access_secret" {
  repository       = "crowdinvestin.me"
  secret_name      = "STAGINGL_AWS_ACCESS_SECRET"
  plaintext_value  = module.aws-serverless-backend_staging.secret_key
}

resource "github_actions_secret" "staging_clerk_api_key" {
  repository       = "crowdinvestin.me"
  secret_name      = "STAGING_CLERK_API_KEY"
  plaintext_value  = var.staging_clerk_api_key
}
