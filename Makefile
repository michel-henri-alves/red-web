deploy:
	npm install && \
	npm run build && \
	aws s3 sync dist/ s3://red-web-dev --delete && \
	aws cloudfront create-invalidation --distribution-id E2XHRVYUHIIIIZ --paths "/*"