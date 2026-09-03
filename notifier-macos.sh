#!/bin/bash
# runs every 5 minutes in my macbook to send me notifs
if [ -f "$HOME/.bashrc" ]; then # if there is a bashrc, source it, since
    source "$HOME/.bashrc"      # it has the token
fi

export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"
cd "$(dirname "$0")" # cd into the dir this script is in. not sure why i added this
# source ./lilyterm.sh # no need anymore, bashrc should also source lilyterm.sh

trunc() { # helper function to truncate a line and add
          # ellipses only if it has been truncated
    local max_len="${1:-20}" # default max len 20
    local line
    if IFS= read -r line; then # this takes in the line from pipe
        if (( ${#line} > max_len )); then # if its too long...
            echo "${line:0:max_len}..."   # truncate and add ellipses.
        else                              # if it isnt...
            echo "$line"                  # leave it as it is.
        fi
    fi
}

apple_escape() { # escape the text before it goes to osascript to prevent RCE
    local s="${1//\\/\\\\}"
    s="${s//\"/\\\"}"
    printf '%s' "$s"
}

notify() { # helper to notify me using osascript
    local title subtitle body

    # escape the inputs to prevent RCE
    title=$(apple_escape "$1")
    subtitle=$(apple_escape "$2")
    body=$(apple_escape "$3")

    if [[ -n "$2" ]]; then # if there is a subtitle use it
        osascript -e "display notification \"$body\" with title \"$title\" subtitle \"$subtitle\" sound name \"Glass\""
    else # otherwise ignore it
        osascript -e "display notification \"$body\" with title \"$title\" sound name \"Glass\""
    fi
}

messages=$(lily messages_raw) # gets the raw messages
unnotified=$(echo "$messages" | jq -c "[ .[] | select(.notified == false) ]") # filter for ones we havent notified for
length=$(echo "$unnotified" | jq -r "length") # how many messages
body="uhh a bug occured" # this should be overwritten. if it isnt then i can see that a bug occured

# if there's nothing to notify, exit out.
if ((length == 0));then
    exit
fi

# if my laptop is locked, wait it's unlocked before sending the notif.
while [[ "$(/usr/sbin/ioreg -n Root -d1 -a | /usr/bin/plutil -extract 'IOConsoleUsers.0.CGSSessionScreenIsLocked' raw - 2>/dev/null)" == "true" ]]; do
    sleep 2
done

# if there were multiple messages from one IP address within the 5 minutes, dont flood my notifs and send one notif for it.
first_ip=$(echo "$unnotified" | jq -r ".[0].ip | split(\" \")[0]") # the ip is in the first part of the ip string
first_count=$(echo "$unnotified" | jq -r --arg ip "$first_ip" "[ .[] | select((.ip | split(\" \")[0]) == \$ip) ] | length")
if ((first_count > 1)); then
    notify "$first_count messages" "" "Multiple messages from single IP"
fi

for ((i=0; i<length; i++)); do # for all messages

    # get the message and the ip
    msg=$(echo "$unnotified" | jq -c ".[$i]")
    ip=$(echo "$msg" | jq -r ".ip | split(\" \")[0]")

    # multiple msgs from same ip
    if ((first_count > 1)) && [[ "$ip" == "$first_ip" ]]; then
        continue
    fi

    echo "$msg" # debug

    body=$(echo "$msg" | jq -r ".message" )
    priority=$(echo "$msg"| jq -r 'if .priority == true then " HIGH PRIORITY" else "" end')
    lines=$(printf '%s\n' "$body" | wc -l)

    echo "$lines" # debug

    # split up the message into the first line and the rest if needed
    first_line=$(printf '%s\n' "$body" | head -n 1)

    if ((lines == 1));then
        notify "New${priority} Message" "" "$first_line"
    else
        rest=$(printf '%s\n' "$body" | tail -n +2)
        notify "New${priority} Message" "$rest" "$first_line"
    fi

    sleep 2 # wait a bit before the next msg
done

lily mark notified true 0 2147483647 # mark everything as notified so we dont notify for these again
