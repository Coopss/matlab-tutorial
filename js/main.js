
$(function() {

    function getCaretPosition (ctrl) {
    	// IE < 9 Support
    	if (document.selection) {
    		ctrl.focus();
    		var range = document.selection.createRange();
    		var rangelen = range.text.length;
    		range.moveStart ('character', -ctrl.value.length);
    		var start = range.text.length - rangelen;
    		return {'start': start, 'end': start + rangelen };
    	}
    	// IE >=9 and other browsers
    	else if (ctrl.selectionStart || ctrl.selectionStart == '0') {
    		return {'start': ctrl.selectionStart, 'end': ctrl.selectionEnd };
    	} else {
    		return {'start': 0, 'end': 0};
    	}
    }

    function waitForElementToDisplay(selector, time) {
        if(document.querySelector(selector)!=null) {
            return;
        }
        else {
            setTimeout(function() {
                waitForElementToDisplay(selector, time);
            }, time);
        }
    }

    function insertTask(task) {
        // console.log(task);
        var tc = $('#task-container');
        var html = "";

        // Card header
        html += '<div id="' + "task" + task.taskNumber + '" class="card">';
        html += '<div class="card-header">';
        html += '<a class="card-link" data-toggle="collapse" href="#collapse_'+ "task" + task.taskNumber + '">';
        html += 'Task ' + task.taskNumber + '</a></div>';

        // Card body
        html += '<div id="collapse_' + 'task' + task.taskNumber + '" class="collapse' + (task.taskNumber == 1 ? ' show"' : '"') + ' data-parent="#task-container">';
        html += '<div class="card-body">';
        html += task.description;
        html += '<div class="task-box">';
        html += '<b>Task</b>';
        html += '<div class="task-contents">';
        html += task.task;
        html += '</div></div>';

        // Help box
        html += '<div class="help-box">';
        html += '<hr/>';
        html += '<a id="' + 'task' + task.taskNumber + '_hint" href="#">Hint</a> | <a id="'+ 'task' + task.taskNumber + '_solution" href="#"> See Solution </a>';
        html += '<hr/>';
        html += '<div id="' + 'task' + task.taskNumber + '_hint_text">';
        html += '</div>';
        html += '<div id="'+ 'task' + task.taskNumber + '_solution_text">';
        html += '</div></div></div></div></div>';


        // Set html and then add event listeners onclick for hint and solution.
        tc.append(html).promise().done(function(){
            $('#task'+ task.taskNumber + '_hint').click(function(e) {
                e.preventDefault();
                let text_area = $('#task' + task.taskNumber + '_hint_text');
                // implement hiding
                if (text_area.html() != '') {
                    text_area.html('');
                } else {
                    let hint_text = "<b>Hint</b>";
                    hint_text += "<p>" + task.hint +"</p>";
                    text_area.html(hint_text);
                }
            });

            $('#task'+ task.taskNumber + '_solution').click(function(e) {
                e.preventDefault();
                let text_area = $('#task' + task.taskNumber + '_solution_text');
                // implement hiding
                if (text_area.html() != '') {
                    text_area.html('');
                } else {
                    let hint_text = "<b>Solution</b>";
                    hint_text += "<p>" + task.solution +"</p>";
                    text_area.html(hint_text);
                }
            });
        });

        // Save some data props to the dom objects.
        $("#collapse_task" + task.taskNumber).data("taskNumber", task.taskNumber);
        $("#collapse_task" + task.taskNumber).data("solution", task.raw_solution);
        $("#collapse_task" + task.taskNumber).data("computedSolution", task.computed_solution);
        if (task.variable_text != null)
            $("#collapse_task" + task.taskNumber).data("variableText", task.variable_text);
        else
            $("#collapse_task" + task.taskNumber).data("variableText", "ans");
        $("#collapse_task" + task.taskNumber).data("status", null);
    }

    function getCurrentTaskData() {
        let ct = $('.collapse.show');
        return ct.data();
    }

    function isCorrect(uip, cip) {
        return uip == cip;
    }

    function getNextIncompleteTask() {
        // find next incomplete task
        for (let i = 1; i <= numTasks; i++) {
            let status = $('#task' + i + ' .collapse').data()['status'];
            if (status == false || status == null) {
                return i;
            }
        }
        return null;
    }

    function completeTask(tid) {
        // put little check mark on the task
        let t = $('#task' + tid + ' .card-link');
        t.html('Task '+ tid + ' &#10004;');

        // complete current task
        $('.collapse.show').data()['status'] = true;

        // next task id to open
        let nid = getNextIncompleteTask();

        // case where everything is solved
        if (nid == null) {
            $("#task" + tid + " .card-link").click();
        // still some unsolved problems
        } else {
            if ($('#task' + nid) != null) {
                $("#task" + nid + " .card-link").click();
                return nid;
            } else {
                console.log("done.");
                return null;
            }
        }
    }

    function failTask(tid) {
        let t = $('#task' + tid + ' .card-link');
        // get current status
        let curStatus = $('.collapse.show').data()['status'];
         // = false;
        // console.log(t.html().search('&#10060;'));
        if (curStatus == null) {
            t.append(' &#10060;');
            $('.collapse.show').data()['status'] = false;
        }
    }

    // Global prompt
    var prompt = ">> ";
    var numTasks = 0;

    // Set intial prompt
    $( "#commandWindow" ).val(prompt);

    // When user presses new line perform input validation and print new prompt.
    $( "#commandWindow" ).keypress(function(event) {
        if (event.which == 13 ) {
            event.preventDefault();

            // get latest input line
            let promptIndex = this.value.lastIndexOf(prompt) + prompt.length;
            let line = this.value.substring(promptIndex, this.value.length);

            // line not empty case
            if (line.length > 0) {
                // process input
                let dat = getCurrentTaskData();
                if (dat != null) {
                    if (isCorrect(line, dat.solution)) {
                        console.log("CORRECT");
                        this.value = this.value + "\n" + dat.variableText + " = \n\t" + dat.computedSolution;
                        this.value = this.value + "\n\nCorrect!\n";
                        completeTask(dat.taskNumber);
                    }
                    else {
                        this.value = this.value + "\nIncorrect\n";
                        failTask(dat.taskNumber);
                        // check if the hint is already displayed, if so, dont redisplay.
                        if ($('#task' + dat.taskNumber + '_hint_text').html() == '')
                            $('#task'+ dat.taskNumber + '_hint').click();

                        console.log("INCORRECT");
                    }
                } else {
                    console.warn('user attempting to enter solution without task');
                }
                console.log(dat);
            }

            this.value = this.value + "\n" + prompt;
        }
        // ensure that the text is locked to the bottom.
        // this.scrollTop(this.scrollHeight);
    });

    // Prevent deletion of the prompt and previous entries.
    $( "#commandWindow" ).keydown(function(event) {
        var inp = String.fromCharCode(event.keyCode);
        if (/[a-zA-Z0-9-_ ]/.test(inp)) {
            let pos = getCaretPosition(this);
            let lastIndexOfPrompt =  this.value.lastIndexOf(prompt);

            if (pos.end < lastIndexOfPrompt + prompt.length) {
                event.preventDefault();
            }
        }

        if (event.keyCode == 8 || event.keyCode == 46) {
            let pos = getCaretPosition(this);
            let lastIndexOfPrompt =  this.value.lastIndexOf(prompt);

            if (pos.end <= lastIndexOfPrompt + prompt.length) {
                event.preventDefault();
            }
        }
    })

    // Load problem set for this window
    $.getJSON("problems/basics.json", function(json) {
        $.each(json, function(task) {
            insertTask(json[task]);
            numTasks += 1;
        });
    });

})

/*
// task template
"taskN": {
    "taskNumber" : N,
    "description" : "",
    "task" : "",
    "hint" : "",
    "variable_text" : "",
    "solution" : "",
    "raw_solution" : "",
    "computed_solution" : ""
}
*/
