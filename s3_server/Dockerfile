FROM nginx:stable-alpine as production-stage
COPY default.conf.template /etc/nginx/templates/default.conf.template
EXPOSE 5660
CMD ["nginx", "-g", "daemon off;"]

HEALTHCHECK --interval=30s --timeout=10s --start-period=3s --retries=2 CMD curl -so /dev/null http://localhost:5660 || exit 1
