variable "region" {
    description = "AWS region"
}
variable "keyname" {
    description = "Public key name"
}
variable "public_key" {
    description = "Public key file path"
}
variable "private_key" {
    description = "Private key file path"
}
variable "ami" {
    description = "Ubuntu AMI"
    default = "ami-042e8287309f5df03"
}