resource "aws_instance" "bitlink" {
  ami           = "ami-02b8269d5e85954ef"
  instance_type = var.instance_type
  key_name      = var.key_name

  vpc_security_group_ids = [
    data.aws_security_group.bitlink_existing.id
  ]

  root_block_device {
    volume_size = 16
    volume_type = "gp3"
  }

  tags = {
    Name = "Bitlink Web Server"
  }
}