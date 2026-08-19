#!/bin/bash
# a voter asked me to add comments so im doin it
if [ -f "$HOME/.bashrc" ]; then
    source "$HOME/.bashrc" # this has the token
fi
export \
    PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"
cd "$(dirname "$0")"
# source ./lilyterm.sh # no need anymore, bashrc should also source lilyterm.sh
trunc() { # truncates and adds a ... only if its truncated
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

apple_escape() { # escapes stuff so pesky XSSers can't get me
    #
    local s="${1//\\/\\\\}"
    s="${s//\"/\\\"}"
    printf '%s' "$s"
}

notify() { # sends a notification
    local title subtitle body
    title=$(apple_escape "$1")
    subtitle=$(apple_escape "$2")
    body=$(apple_escape "$3")
    if [[ -n "$2" ]]; then
        osascript -e "display notification \"$body\" with "\
            "title \"$title\" subtitle \"$subtitle\" sound name \"Glass\""
    else
        osascript -e "display notification \"$body\" with "\
            "title \"$title\" sound name \"Glass\""
    fi
}

messages=$(lily messages_raw) # see lilyterm.sh for the source of this command
unnotified=$(echo "$messages" | jq -c "[ .[] | select(.notified == false) ]")
    # this uses the jq tool to select all messages with the notified flag unset
length=$(echo "$unnotified" | jq -r "length")
    # this is the amount of those msgs
body="uhh a bug occured" # its that because body should be overwritten
                         # if it isnt then there's a bug and i will see it
if ((length == 0));then
    exit
fi
#{
while [[ "$(/usr/sbin/ioreg -n Root -d1 -a | /usr/bin/plutil -extract \
'IOConsoleUsers.0.CGSSessionScreenIsLocked' raw - 2>/dev/null)" == "true" ]]; do
    sleep 2 
done
#}these 4 lines wait until i unlock my Mac if its locked
# otherwise it will notify but i wont be there to hear it
# plus, it prevents anyone who is not me from seeing it.
grouped_ips=$(echo "$unnotified" | jq -r '
  [ .[] | {ip: (.ip | split(" ")[0]), msg: .} ] | group_by(.ip) | .[] |
select(length > 1) |  {ip: .[0].ip, count: length}
' | jq -sc '.') # holy complicated jq expression, but it finds msgs sent
                # from the same IP to group them.
grouped_count=$(echo "$grouped_ips" | jq 'length') # how many ips are grouped
#{
for ((g=0; g<grouped_count; g++)); do
    gip=$(echo "$grouped_ips" | jq -r ".[$g].ip")
    gcnt=$(echo "$grouped_ips" | jq -r ".[$g].count")
    notify "$gcnt messages" "" "Multiple messages from $gip"
done
#}it sends only a single notif for each ip that has sent multiple msgs within
# the 5 minute period so i dont get notif spammmed
for ((i=0; i<length; i++)); do # for each message...
    msg=$(echo "$unnotified" | jq -c ".[$i]")
    ip=$(echo "$msg" | jq -r ".ip | split(\" \")[0]")
    #{
    is_grouped=$(echo "$grouped_ips" | jq -r --arg ip "$ip"
        '[ .[] | select(.ip == $ip) ] | length')
    if ((is_grouped > 0)); then
        continue
    fi
    #}dont renotify me for grouped messages
    echo "$msg" # debug
    body=$(echo "$msg" | jq -r ".message" )
    priority=$(echo "$msg"| jq -r
    'if .priority == true then " HIGH PRIORITY" else "" end')
    lines=$(printf '%s\n' "$body" | wc -l) # num of lines
    echo "$lines" # debug
    first_line=$(printf '%s\n' "$body" | head -n 1)
    if ((lines == 1));then
        notify "New${priority} Message" "" "$first_line"
    else
        rest=$(printf '%s\n' "$body" | tail -n +2)
        notify "New${priority} Message" "$rest" "$first_line"
        # when multiple lines, show the first line as if its a subject
    fi
    sleep 2
done

lily mark notified true 0 2147483647 # mark EVERYTHING notified!!
