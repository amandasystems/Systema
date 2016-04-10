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

    this.nextId = 8;
  }

  getTaskById(taskId) {
    return this.tasks.find((task) => {return task.id === taskId});
  }

  /**
   * Advance the task with the given ID one step. May wrap around.
   * @return The same task with its new todo information.
   */
  nextTodoState(taskId) {
    console.log("Model: advancing TODO state of task with id " + taskId);

    var nts = this.tasks.map((task) => {
      if(task.id === taskId) {
        var newTask = task;
        newTask.todo = "DONE";
        newTask.is_done = true;
        return newTask;
      }

      else {
        return task;
      }
    });

    this.tasks = nts;

    return this.getTaskById(taskId);

  }

  allActiveProjects() {
    return this.projects;
  }

  allActiveTasks() {
    return this.tasks;
  }

  allUserTags() {

  }

  allTodoStates() {

  }

  /**
   * Add a new task to the collection.
   * @return the new collection of active tasks with the new task added.
   */
  addTask(description, todo, tags, effort) {
    var newTask = {id: this.nextId,
                   description: description,
                   tags: tags,
                   is_done: false,
                   todo: todo,
                   effort: effort
                  };

    this.tasks.push(newTask);
    this.nextId++;
    return this.allActiveTasks();
  }

  updateTask() {

  }

  save () {
  }
}
