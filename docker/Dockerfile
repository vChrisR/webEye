FROM phusion/passenger-nodejs:0.9.14
MAINTAINER Christiaan Roeleveld <croeleveld@gmail.com>
# Set correct environment variables.
ENV HOME /root

# Use baseimage-docker's init process.
CMD ["/sbin/my_init"]

ADD default /etc/nginx/sites-enabled/default
ADD rabbitmq-env.conf /etc/nginx/main.d/rabbitmq-env.conf
RUN rm -f /etc/service/nginx/down && cd /home/app && git clone https://github.com/vChrisR/webEye.git
RUN chown app /home/app/webEye

ENV DEBUG=webEye

# Clean up APT when done.
RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
EXPOSE 80
