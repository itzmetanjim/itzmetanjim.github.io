#!/bin/bash
# Terminal integration
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    # if tihs is executed using ./lilyterm.sh then the functions wont register as it isnt being run on the same shell
    echo "lilyterm.sh: You have to source this script: source lilyterm.sh"
    exit 1
fi

if [[ -z "${LILY_TOKEN:-}" ]];then
    echo 'lilyterm.sh: Variable $LILY_TOKEN must be set.' # duh
    exit
fi

which jq > /dev/null 2>/dev/null ||{ echo 'lilyterm.sh: jq isnt installed';return ;} # i use jq heavily to parse json responses

lily(){
    if [[ "$1" == "messages_raw" ]];then
        curl --json "{\"token\":\"$LILY_TOKEN\"}" https://8051.proxy.tanjim.org/getall | jq .messages # the raw messages dict, for automation
    fi

    if [[ "$1" == "getall" ]];then
        curl --json "{\"token\":\"$LILY_TOKEN\"}" https://8051.proxy.tanjim.org/getall # the entire raw memory, for automation
    fi

    if [[ "$1" == "messages" ]];then # user-friendly messages function
        local filter=$2

        #convert these into jq filters
        if [[ "$filter" == "" ]]; then local filter="true";fi
        if [[ "$filter" == "unread" ]]; then local filter=".read == false";fi
        if [[ "$filter" == "unnotified" ]];then local filter=".notified == false";fi
        if [[ "$filter" == "read" ]];then local filter=".read == true"; fi
        if [[ "$filter" == "notified" ]];then local filter=".notified == true"; fi

        # curl the api
        curl --json "{\"token\":\"$LILY_TOKEN\"}" https://8051.proxy.tanjim.org/getall 2>/dev/null | jq -r \
            '.messages[] | select('"$filter"') |"\n\n\u001b[1;38;5;205mID:\u001b[0m \(.id)\n\u001b[1;38;5;205m\(.ip)\u001b[0m\n\u001b[1;38;5;205m\(if .priority then "\u001b[31mHIGH PRIORITY\u001b[1;38;5;205m" else "low priority" end), \(if .read then "read" else "unread" end), \(if .notified then "notified" else "not notified" end)\nMessage:\u001b[0m\n\(.message)\n" '
    fi

    if [[ "$1" == "mark" ]];then #set or unset flags on messages
        # check if the user passed in all rquired args
        [[ -z "${2:+x}" ]] && { echo "Usage: lily mark <type> <value> <start> [end]"; return 1; }
        [[ -z "${3:+x}" ]] && { echo "Usage: lily mark <type> <value> <start> [end]"; return 1; }
        [[ -z "${4:+x}" ]] && { echo "Usage: lily mark <type> <value> <start> [end]"; return 1; }

        #if only one id passed, delete just that
        local end=$5
        [[ -z "${5+x}" ]] && { end=$4 ; }

        # curl the api
        curl --json "{\"token\":\"$LILY_TOKEN\",\"start\":$4,\"end\":$end,\"type\":\"$2\",\"value\":$3}" https://8051.proxy.tanjim.org/mark 2>/dev/null | grep -qx "{\"ok\":true}"
    fi
    if [[ "$1" == "read" ]];then # shortcut to mark as read. aliases to: lily mark read true
        [[ -z "${2:+x}" ]] && { echo "Usage: lily read <start> [end]"; return 1; } #check if required arg passed
        lily mark read true $2 ${3:-}
    fi
    if [[ "$1" == "readall" ]];then # read everything
        lily mark read true 0 2147483647 # "everything"
    fi
    if [[ "$1" == "delete" ]];then
        [[ -z "${2:+x}" ]] && { echo "Usage: lily delete start [end]"; return 1; } # check if required arg passed

        # if only one id passed, delete just that
        local end=$3
        [[ -z "${3+x}" ]] && { end=$2 ; }

        #curl the api
        curl --json "{\"token\":\"$LILY_TOKEN\",\"start\":$2,\"end\":$end}" https://8051.proxy.tanjim.org/delete 2>/dev/null | grep -qx "{\"ok\":true}"
    fi
}

# alert in the terminal
if [[ $- == *i* ]]; then #this means "if running on interactive shell" since we dont want automation scripts to do this
    ({
        output=$(lily messages unread)
        if [[ -z "$output" ]];then
            :
        else
            echo
            # grep is being used as a simple way to color the command if colors are supported so i dont have to do escape code mess
            echo "You have unread messages. Use lily messages unread to check them." | grep "lily messages unread"
        fi
    }&) # & means to run in background
fi

