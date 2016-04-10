'use babel';
var sqlite3 = require('sqlite3').verbose();

export class TodoModel {
  constructor(dbHandle) {
    this.db = dbHandle;

    // Mock data!
    this.tasks = [{id: 1, todo: "TODO", is_done: false, description: "Finish up the design for Systema", tags: ["design", "today"], effort: 105},
                  {id: 2, todo: "TODO", is_done: false, description: "Design a pretty logo (see also #1)", tags: ["home", "computer"], effort: 90},
                  {id: 3, todo: "TODO", is_done: false, description: "Do the dishes", tags: ["housework", "brain-free"], effort: 1232},
                  {id: 6, todo: "DONE", is_done: true, description: "Clean the bathroom", tags: ["housework", "brain-free", "today"], effort: 20},
                  {id: 7, todo: "WAITING", is_done: false, description: "Reply from someone", tags: ["delegated"], effort: 0}];
    this.projects = [{id: 4, is_stalled: false,
                      description: "Project Z",
                      comment: "A slightly longer project example.",
                      tags : ["project-tag"]},
                     {id: 5, is_stalled: true,
                      description: "A stalled project",
                      comment: "This project is unfortunately stalled. :(",
                      tags : ["sourdoughs"]}];
  }

  /**
   * Advance the task with the given ID one step, and return the new
   * task.
   */
  nextTodoState(taskId) {

  };

  allActiveProjects() {
    return this.projects;
  };

  allActiveTasks() {
    return this.tasks;
  };

  allUserTags() {

  };

  allTodoStates() {

  };

  addTask() {

  }

  updateTask() {

  }

  save () {
  }
}
