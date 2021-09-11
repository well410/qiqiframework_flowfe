FROM csbase.registry.cmbchina.cn/paas/cmb-nginx-1.9.7:v1.1.0

# 特别注明：拷贝 应用打包后的目录（如果是走流水线，就是流水线编译脚本中的--build.dist值）====》基础镜像中的部署目录。
# 所以copy指令后面的 "./"  路径 需要根据你流水线编译步骤的构建脚本更改，比如流水线中编译脚本中  --build.dist="./dist"，那么下面也要改成 "COPY ./dist ${DEPLOYMENTS_DIR}/"
COPY ./dist ${DEPLOYMENTS_DIR}/

RUN mv ${DEPLOYMENTS_DIR}/nginx.conf ${NGINX_HOME}/conf/nginx.conf

EXPOSE 8080

CMD ["/opt/nginx/sbin/nginx","-p","/opt/nginx","-c","/opt/nginx/conf/nginx.conf"]