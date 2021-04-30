#!/bin/bash -e

function cleanup {
  echo ">>>>>>>>>>>>>> interrpted from terminal -- stopping flask server runnning on <$1>"
  kill -TERM $1
  echo ">>>>>>>>>>>>>> exiting"
}


while true
do
    TIME=$( date +%s  ) # get timestamp
    echo ">>>>>>>>>>>>>> starting flask server --> $TIME"
    python app.py & # start in background
    CMDPID=$! # get pid of that command
    echo " <><><><> $CMDPID"
    trap 'cleanup $CMDPID' EXIT

    # next while loop just keeps checking time
    # We don't want to block up CPU with 
    # continuous sleep command
    LIMIT=$[($TIME+3600*24)]
    echo ">><<>> $LIMIT"
    while [ $(date +%s) -lt $LIMIT ];
    do  
      TIME_rem=$[$LIMIT-$(date +%s)]
      echo ">>>>>>>>>>>>>> server will be reloaded after $TIME_rem seconds" 
      sleep 60
    done
    echo ">>>>>>>>>>>>>> killing flask server"
    kill -TERM $CMDPID # kill that process

    # return to the top and repeat the procedure    
done