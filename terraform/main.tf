provider "aws" {
  region = var.region
}
resource "aws_key_pair" "deployer" {
  key_name   = var.keyname
  public_key = file(var.public_key)
}

resource "aws_vpc" "main" {
  cidr_block       = "10.0.0.0/16"
  instance_tenancy = "default"

  tags = {
    Name = "VPC-Main"
  }
}

resource "aws_subnet" "main" {
  vpc_id     = aws_vpc.main.id
  cidr_block = "10.0.1.0/24"

  tags = {
    Name = "Public-Subnet"
  }
}

resource "aws_subnet" "private_main" {
  vpc_id     = aws_vpc.main.id
  cidr_block = "10.0.2.0/24"

  tags = {
    Name = "Private-Subnet"
  }
}

resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "Internet-Gateway"
  }
}

resource "aws_route_table" "route_table" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gw.id
  }

  route {
    ipv6_cidr_block = "::/0"
    gateway_id      = aws_internet_gateway.gw.id
  }

  tags = {
    Name = "RouteTable-Main"
  }
}

resource "aws_route_table_association" "main_rt" {
  subnet_id      = aws_subnet.main.id
  route_table_id = aws_route_table.route_table.id
}

resource "aws_route_table_association" "private_main_rt" {
  subnet_id      = aws_subnet.private_main.id
  route_table_id = aws_route_table.route_table.id
}


resource "aws_eip" "eip" {
  vpc = true
}

resource "aws_instance" "uberapp_ec2" {
  ami                    = var.ami
  instance_type          = "t2.micro"
  key_name               = aws_key_pair.deployer.key_name
  vpc_security_group_ids = ["${aws_security_group.allow_fe_be.id}"]

  connection {
    host        = aws_instance.uberapp_ec2.public_dns
    type        = "ssh"
    user        = "ubuntu"
    private_key = file(var.private_key)
  }

  provisioner "remote-exec" {
    inline = [
      "echo 'GUNICORN'",
      "sudo apt update",
      "sudo apt install software-properties-common",
      "sudo add-apt-repository ppa:deadsnakes/ppa -y",
      "sudo apt install git -y",
      "sudo apt-get install tmux -y",
      "sudo apt install python3.9 -y",
      "sudo apt install -y python3-pip",
      "git clone https://github.com/pritesh-chauhan/Devops-MidTerm.git",
      "cd ~/Devops-MidTerm/uberbusbackend",
      "sudo apt install python3-venv -y",
      "pip3 install flask",
      "pip3 install flask-cors",
      "pip3 install flask-api",
      "pip3 install gunicorn",
      "pip3 install wheel",
      "pip3 install python-dotenv",
      "pip3 install pymongo",
      "pip3 install python-dateutil",
      "pip3 install pytz",
      "pip3 install dnspython",
      "pip3 install requests",
      "sudo mv uberbusbackend.service /etc/systemd/system/uberbusbackend.service",
      "sudo systemctl daemon-reload",
      "sudo systemctl start uberbusbackend",
      "sudo systemctl enable uberbusbackend",
      "echo 'NGINX'",
      "cd",
      "sudo apt-get update",
      "sudo apt remove -y libcurl4",
      "sudo apt-get install -y libcurl4 curl",
      "curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -",
      "sudo apt-get install -y ruby",
      "sudo apt-get install -y nodejs",
      "sudo apt-get install nginx -y",
      "sudo apt-get install -y build-essential",
      "cd ~/Devops-MidTerm/uberbusfrontend",
      "sudo echo 'REACT_APP_IP_ADDRESS=${aws_eip.eip.public_ip}' > .env",
      "sudo npm install",
      "sudo npm run build",
      "cd ~",
      "sudo rm /etc/nginx/sites-enabled/default",
      "sudo mv ~/Devops-MidTerm/uberbusfrontend/uberbusfrontend.nginx /etc/nginx/sites-available/",
      "sudo ln -s /etc/nginx/sites-available/uberbusfrontend.nginx /etc/nginx/sites-enabled/uberbusfrontend.nginx",
      "sudo systemctl start nginx",
      "sudo systemctl reload nginx"
    ]
  }

}


resource "aws_security_group" "allow_fe_be" {
  name = "allow_fe_be"
  ingress {
    protocol    = "tcp"
    from_port   = 80
    to_port     = 80
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    protocol    = "tcp"
    from_port   = 22
    to_port     = 22
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    protocol    = "tcp"
    from_port   = 3000
    to_port     = 3000
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    protocol    = "tcp"
    from_port   = 5000
    to_port     = 5000
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_eip_association" "eip_assoc" {
  instance_id   = aws_instance.uberapp_ec2.id
  allocation_id = aws_eip.eip.id
}
