#!/bin/bash
if [ -f "$HOME/.bashrc" ]; then
    source "$HOME/.bashrc" # this has the token
fi
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"
cd "$(dirname "$0")"
# source ./lilyterm.sh # no need anymore, bashrc should also source lilyterm.sh
trunc() {
    local max_len="${1:-20}"
    local line
    if IFS= read -r line; then
        if (( ${#line} > max_len )); then
            echo "${line:0:max_len}..."
        else
            echo "$line"
        fi
    fi
}

messages=$(lily messages_raw)
unnotified=$(echo "$messages" | jq -c "[ .[] | select(.notified == false) ]")
length=$(echo "$unnotified" | jq -r "length")
body="uhh a bug occured"
if ((length == 0));then
    exit
fi
while [[ "$(/usr/sbin/ioreg -n Root -d1 -a | /usr/bin/plutil -extract 'IOConsoleUsers.0.CGSSessionScreenIsLocked' raw - 2>/dev/null)" == "true" ]]; do
    sleep 2
done
first_ip=$(echo "$unnotified" | jq -r ".[0].ip | split(\" \")[0]")
first_count=$(echo "$unnotified" | jq -r --arg ip "$first_ip" "[ .[] | select((.ip | split(\" \")[0]) == \$ip) ] | length")
if ((first_count > 1)); then
    osascript -e 'display notification "'"$first_count"' messages" with title "Multiple messages from single IP" sound name "Glass"'
fi
for ((i=0; i<length; i++)); do
    msg=$(echo "$unnotified" | jq -c ".[$i]")
    ip=$(echo "$msg" | jq -r ".ip | split(\" \")[0]")
    if ((first_count > 1)) && [[ "$ip" == "$first_ip" ]]; then
        continue
    fi
    echo $msg
    body=$(echo "$msg" | jq -r ".message" )
    priority=$(echo "$msg"| jq -r 'if .priority == true then " HIGH PRIORITY" else "" end')
    lines=$(echo "$body" | wc -l)
    echo $lines
    if ((lines == 1));then
        osascript -e 'display notification "'"$(echo $body | head -n 1)"'" with title "New'"$priority"' Message" sound name "Glass"'
    else
        osascript -e 'display notification "'"$(echo $body | head -n 1)"'" with title "New'"$priority"' Message" subtitle "'"$(echo $body | tail -n +2)"'" sound name "Glass"'
    fi
    sleep 2
done

lily mark notified true 0 2147483647
