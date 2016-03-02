var Chat = {
    init: function() {
        // Start shuffling bubbles
        setInterval(function() { Chat.shuffleBubbles(); }, this.getSettings().pushTime);

        // Start listening for chat input
        $("#chat-input").keyup(function(e) {
            if (e.which != 13) return;

            e.preventDefault();

            // Remove any dust from the side of it
            var message = $("#chat-input").val().trim();

            // If the message isn't blank, create it
            if (message != "" && ! Chat.handleAsLocalCommand(message)) Chat.create("Mark", message, null);

            // Clear chat field
            $("#chat-input").val("");
        });
    },
    getSettings: function() {
        // Return settings from a function so they cannot be changed
        // in run-time (at least, easily).

        var settings = {
            pushTime: 2500,
            changeAmount: 30,
        };

        return settings;
    },
	shuffleBubbles: function() {
        $.each($("body").find("x-bubble"), function(i, msg) {

            var $msg          = $(msg);

            var scrollTop     = $(window).scrollTop(),
                elementOffset = $msg.offset().top,
                distance      = (elementOffset - scrollTop);

            var msgTop = distance - Chat.getSettings().changeAmount;
            
            // Update msg top
            $msg.css("top", msgTop);

            // Remove if its well-off the screen
            if (msgTop < -100) $msg.remove();
        });
	},
	create: function(name, message, left) {
        // TODO: Using the left variable, specify how left the
        //       chat message will be.
        //       left should be 1 - 5, which translates to 10vw - 50vw

        if (left == null || left > 5) left = 2;

		this.shuffleBubbles();

        // Remove HTML entities from message
		message = this.escapeHtmlEntities(message);

        // Create a unique ID - in future this should corrospond server-side
        // maybe with logging or something ?
        var id = name + "-" + Math.floor(Math.random()*10000) + "-" + left;

        $ ("<x-bubble id='" + id + "'>" +
                "<x-chat-name>" + name + "</x-chat-name>" +
                "<x-chat-msg>" + message + "</x-chat-msg>" +
            "</<x-chat-msg>")
        .appendTo("body")
        .css({
            "top": 200,
            "left": left + "0vw"
        });
	},
    escapeHtmlEntities: function(text) {
        return text;
    },
    handleAsLocalCommand: function(text) {
        if (text.trim() == "/teditor") {
            ige.editor.toggle();
            return true;
        }

        return false;
    },
};

Chat.init();