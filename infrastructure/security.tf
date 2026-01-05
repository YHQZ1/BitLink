# NOTE:
# This security group is pre-existing and intentionally NOT managed by Terraform.
# It is referenced via a data source to avoid forced recreation.

data "aws_security_group" "bitlink_existing" {
  id = "sg-029f20eef51f589f8"
}
