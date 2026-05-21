FROM minio/minio:latest

COPY setup.sh /setup.sh
RUN chmod +x /setup.sh

EXPOSE 9000 9001

ENTRYPOINT ["/setup.sh"]
