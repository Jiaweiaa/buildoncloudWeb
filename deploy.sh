#!/usr/bin/env bash

WEB_PATH='/home/workerman/opt/html'
WX_PATH='/home/workerman/opt/wx-html'


WX_PROJ_PATH='/root/.jenkins/workspace/buildOnCloud-wxManager-web'
WX_WEB_PATH='/root/.jenkins/workspace/前端测试环境'

VUE_WEB='buildOnCloudLabor-Web'
VUE_WX='buildOnCloud-wxManager-web'
WEB_WX='buildOnCloud-wx-page'

#WEB_PATH='/home/workerman/opt/test'

packing(){
  cd ${PROJ_PATH}/${VUE_WEB}
  cnpm install
  npm run build

  cd ${WX_PROJ_PATH}/${VUE_WX}
  cnpm install
  npm run build

}

clearMaster(){
  ssh workerman@${INNER_NET_A} rm -rf ${WEB_PATH}/*
  ssh workerman@${INNER_NET_A} rm -rf ${WX_PATH}/*
}

clearMaster_(){
  rm -rf ${WEB_PATH}/*
  rm -rf ${WX_PATH}/*
}

clearSlave(){
  ssh workerman@${INNER_NET_B} rm -rf ${WEB_PATH}/*
  ssh workerman@${INNER_NET_B} rm -rf ${WX_PATH}/*
}

clearSlave_(){
  ssh workerman@${INNER_NET_C} rm -rf ${WEB_PATH}/*
  ssh workerman@${INNER_NET_C} rm -rf ${WX_PATH}/*
}


mvMaster(){
  scp -r ${PROJ_PATH}/${VUE_WEB}/dist/* workerman@${INNER_NET_A}:${WEB_PATH}
  scp -r ${WX_PROJ_PATH}/${VUE_WX}/project workerman@${INNER_NET_A}:${WX_PATH}
  scp -r ${WX_WEB_PATH}/${WEB_WX}/* workerman@${INNER_NET_A}:${WX_PATH}

}


mvMaster_(){
  cp -rf ${PROJ_PATH}/${VUE_WEB}/dist/* ${WEB_PATH}
  cp -rf ${WX_PROJ_PATH}/${VUE_WX}/project ${WX_PATH}
  cp -rf ${WX_WEB_PATH}/${WEB_WX}/* ${WX_PATH}
}

mvSlave(){
  scp -r ${PROJ_PATH}/${VUE_WEB}/dist/* workerman@${INNER_NET_B}:${WEB_PATH}
  scp -r ${WX_PROJ_PATH}/${VUE_WX}/project workerman@${INNER_NET_B}:${WX_PATH}
  scp -r ${WX_WEB_PATH}/${WEB_WX}/* workerman@${INNER_NET_B}:${WX_PATH}

}

mvSlave_(){
  scp -r ${PROJ_PATH}/${VUE_WEB}/dist/* workerman@${INNER_NET_C}:${WEB_PATH}
  scp -r ${WX_PROJ_PATH}/${VUE_WX}/project workerman@${INNER_NET_C}:${WX_PATH}
  scp -r ${WX_WEB_PATH}/${WEB_WX}/* workerman@${INNER_NET_C}:${WX_PATH}

}


test(){
  packing
  clearMaster
  mvMaster
  #clearSlave
  #mvSlave
}

production(){
  packing
  clearMaster_
  mvMaster_
  clearSlave
  mvSlave
  clearSlave_
  mvSlave_
}

delopy(){
    if [ "$scope" = "测试环境" ]; then
        echo "[info >>> TEST]::: ***********发布测试环境***********"
        test
        else
        echo "[info >>> PRODUCTION]::: ***********发布正式环境***********"
        WX_PROJ_PATH='/home/workerman/.jenkins/workspace/buildOnCloud-wxManager-web-prod'
        WX_WEB_PATH='/home/workerman/.jenkins/workspace/前端正式环境'

        production
    fi
}
delopy


