#-  GNU Makefile

#-  Makefile ~~
#
#   This contains live instructions for fast HTML prototyping via CouchDB. I
#   have adapted these instructions from my workflow for rapid development with
#   Quanah (https://quanah.googlecode.com).
#
#                                                       ~~ (c) SRW, 24 Oct 2011

SHELL   :=  sh

APP     :=  quanascope
#URL    :=  http://sean.couchone.com/testing/_design/$(APP)/index.html
#DB     :=  sean.couchone.com/testing
URL     :=  http://sean.couchone.com/apps/_design/$(APP)/index.html
DB      :=  sean.couchone.com:5984/apps
APPRC   :=  $(APP)/.couchapprc

define gray-printf
    printf '\033[1;30m'$(strip $(1))'\033[1;0m' $(strip $(2))
endef

define red-printf
    printf '\033[1;31m'$(strip $(1))'\033[1;0m' $(strip $(2))
endef

define cyan-printf
    printf '\033[1;36m'$(strip $(1))'\033[1;0m' $(strip $(2))
endef

define alert
    $(call red-printf, '--> ERROR: %s\n', $(strip $(1))) >&2
endef

define aside
    $(call gray-printf, '--> %s\n', $(strip $(1)))
endef

define hilite
    $(call cyan-printf, '--> %s\n', $(strip $(1)))
endef

define available
    $(shell \
        for each in $(1); do                                                \
            command -v $${each} >/dev/null 2>&1                         ;   \
            if [ $$? -eq 0 ]; then                                          \
                command -v $${each}                                     ;   \
            fi                                                          ;   \
        done                                                                \
    )
endef

define contingent
    $(shell \
        contingent() {                                                      \
            for each in $$@; do                                             \
                command -v $${each} >/dev/null 2>&1                     ;   \
                if [ $$? -eq 0 ]; then                                      \
                    command -v $${each}                                 ;   \
                    return $$?                                          ;   \
                fi                                                      ;   \
            done                                                        ;   \
            printf 'echo "\033[1;31m(%s)\033[1;0m"' '$(firstword $(1))' ;   \
            return 1                                                    ;   \
        }                                                               ;   \
        contingent $(1)                                                     \
    )
endef

COUCHAPP    :=  $(call contingent, couchapp)
CP          :=  $(call contingent, rsync) --archive
OPEN        :=  $(call contingent, gnome-open open)
RM          :=  $(call contingent, rm) -rf
STTY        :=  $(call contingent, stty)

define read-prompt
    printf '%s' $(1)                                                    ;   \
    read REPLY
endef

define read-secure
    $(STTY) -echo                                                       ;   \
    $(call read-prompt, $(1))                                           ;   \
    $(STTY) echo                                                        ;   \
    printf '\n' ''
endef

.PHONY: all clean clobber reset run

all: run

clean: reset
	@   $(RM) $(APPRC)

clobber: clean
	@   $(RM) $(APP) $(DATA)

reset:
	@   $(call contingent, clear)

run: $(APPRC) $(APP)
	@   $(CP) _attachments $(APP)/                                  ;   \
            $(CP) .couchappignore $(APP)/                               ;   \
            $(CP) couchapp.json $(APP)/                                 ;   \
            $(CP) rewrites.json $(APP)/                                 ;   \
            $(CP) validate_doc_update.js $(APP)/                        ;   \
            echo "# $${RANDOM}" >> $(APP)/_attachments/cache.manifest   ;   \
            cd $(APP) && $(COUCHAPP) push -q                            ;   \
            if [ $$? -eq 0 ]; then                                          \
                $(OPEN) $(URL)                                          ;   \
                $(call hilite, "Deployment succeeded.")                 ;   \
            else                                                            \
                $(call alert, "$$?")                                    ;   \
            fi

###

$(APP):
	@   $(call hilite, "Generating the app ...")                    ;   \
            $(COUCHAPP) generate $(APP)                                 ;   \
            $(RM) $(APP)/_attachments/* $(APP)/evently $(APP)/filters       \
                $(APP)/lists $(APP)/README.md $(APP)/shows                  \
                $(APP)/updates $(APP)/vendor $(APP)/views

$(APPRC): $(APP)
	@   $(strip $(call hilite, "Deploying to $(DB) ...")            ;   \
            printf '%s' '{"env": {"default": {"db": "http://' > $@      ;   \
            $(call read-prompt, "Username: ") && USERNAME="$${REPLY}"   ;   \
            $(call read-secure, "Password: ") && PASSWORD="$${REPLY}"   ;   \
            printf '%s' "$${USERNAME}:$${PASSWORD}@$(DB)" '"}}}' >> $@  )

#-  vim:set syntax=make:
