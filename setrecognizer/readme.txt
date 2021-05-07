# Docker deploy instructions

1. Install docker ubuntu package
You can install docker by the following shell commands:

sudo apt-get update
sudo apt-get upgrade -y
sudo apt-get install -y curl
sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt-get update
sudo apt-get install -y docker-ce

Before building docker image please set parameter 'use_titles_response' in configuration YAML file.
Set 'True' if you need parse pages titles to find set number.

2. Build docker image
sudo docker build -t lego_set_recognition_server .

3. Run server solution:
sudo docker run -p 5000:5000 --name LegoServer -d lego_set_recognition_server

(Optional) If you need see server logs use the following command:
sudo docker run -p 5000:5000 --name LegoServer -it lego_set_recognition_server

4. To delete the containse use the following command:
sudo docker rm LegoServer

5. (Optional) You can test server by the following shell command:
time curl -H "Content-Type: application/json" -X POST -d '{"url":"https://i.ebayimg.com/00/s/NzU4WDExNDg=/z/OKoAAOSwwNdgcFmR/$_59.JPG"}' http://localhost:5000/api/inference/url

6. To run LoopCaller in background mode please execute the following shell command:
screen -dmS LoopCalling bash -c "python3 solvetask_infinite_worker.py --ip=0.0.0.0 --port=5000 --sleep-time=60"

If you need attach to this background process please run the following command:
screen -x LoopCalling

And press keys CTRL + A + D to escape from arrach mode.

If your system has not screen package please install it by the following commands:
sudo apt update
sudo apt install screen
