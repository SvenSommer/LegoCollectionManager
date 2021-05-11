FROM ubuntu:18.04
ADD . /setrecognizer/

# Install dependences + add Chrome Stable + purge all the things
RUN apt-get update && apt-get install -y \
	apt-transport-https \
	ca-certificates \
	curl \
	gnupg \
	--no-install-recommends \
	&& curl -sSL https://dl.google.com/linux/linux_signing_key.pub | apt-key add - \
	&& echo "deb https://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list \
	&& apt-get update && apt-get install -y \
	google-chrome-stable \
	fontconfig \
	fonts-ipafont-gothic \
	fonts-wqy-zenhei \
	fonts-thai-tlwg \
	fonts-kacst \
	fonts-symbola \
	fonts-noto \
	fonts-freefont-ttf \
	--no-install-recommends \
	&& apt-get purge --auto-remove -y curl gnupg \
	&& rm -rf /var/lib/apt/lists/*

# Install general dependences

RUN apt-get update
RUN apt-get install -y screen
RUN apt-get install -y curl
RUN apt-get install -y unzip
RUN apt-get install -y python3-dev
RUN apt-get install -y python3-pip
RUN pip3 install --upgrade pip
RUN apt-get install -y cmake
RUN apt-get install -y git
RUN apt-get install -y ffmpeg

# Install OpenCV depenences

RUN apt-get install -y curl wget nano bzip2 libfreetype6 libgl1-mesa-dev libglu1-mesa libxi6 libxrender1
RUN apt -y remove x264 libx264-dev
RUN apt -y install build-essential checkinstall cmake pkg-config yasm
RUN apt -y install git gfortran
RUN apt -y install libjpeg8-dev libpng-dev
RUN apt -y install software-properties-common
RUN add-apt-repository "deb http://security.ubuntu.com/ubuntu xenial-security main"
RUN apt -y update
RUN apt -y install libjasper1
RUN apt -y install libtiff-dev
RUN apt -y install libavcodec-dev libavformat-dev libswscale-dev libdc1394-22-dev
RUN apt -y install libxine2-dev libv4l-dev
WORKDIR /usr/include/linux
RUN ln -s -f ../libv4l1-videodev.h videodev.h
WORKDIR /
RUN apt -y install libgstreamer1.0-dev libgstreamer-plugins-base1.0-dev
RUN apt -y install libgtk2.0-dev libtbb-dev qt5-default
RUN apt -y install libatlas-base-dev
RUN apt -y install libfaac-dev libmp3lame-dev libtheora-dev
RUN apt -y install libvorbis-dev libxvidcore-dev
RUN apt -y install libopencore-amrnb-dev libopencore-amrwb-dev
RUN apt -y install libavresample-dev
RUN apt -y install x264 v4l-utils
RUN apt -y install libprotobuf-dev protobuf-compiler
RUN apt -y install libgoogle-glog-dev libgflags-dev
RUN apt -y install libgphoto2-dev libeigen3-dev libhdf5-dev doxygen

RUN pip3 install torch==1.7.1
RUN pip3 install torchvision==0.8.2
RUN pip3 install Cython
RUN pip3 install pycocotools

# Download third parties

RUN pip3 install gdown
WORKDIR setrecognizer/
RUN gdown "https://drive.google.com/uc?id=1crszr_QgR_3JR84Z273CMnRgzwH6oq2R"
RUN unzip -o lego_project_data.zip
RUN rm lego_project_data.zip

RUN pip3 install -r requirements.txt
RUN python3 -m pip install paddlepaddle==2.0.0 -i https://mirror.baidu.com/pypi/simple

CMD python3 set_recognition_server.py