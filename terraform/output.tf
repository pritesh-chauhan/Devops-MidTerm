output "public_dns" {
  value = "${aws_instance.uberapp_ec2.public_dns}"
}
output "eip" {
  value = "${aws_eip.eip.public_ip}"
}