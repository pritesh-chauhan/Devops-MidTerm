# Devops-MidTerm- Uber Bus App

## Stacks

1. React
2. Python

## Steps to run application in local

1. Clone project
bash
git clone https://github.com/pritesh-chauhan/Devops-MidTerm.git


2. React in local

bash
cd Devops-MidTerm/uberbusfrontend


bash
npm install


bash
npm build


bash
npm start


3. Python in local

bash
cd Devops-MidTerm/uberbusbackend


bash
python3 uberbackend.py


4. Access react app at http://localhost:3000/

## Steps to access application using Elastic IP address

1. cd Devops-MidTerm/terraform

2. Run terraform file

bash
cd terraform

bash
terraform init
terraform plan
terraform apply

3. Access the application at http://`<Elastic IP>`:80