(function () {
  const { Component } = owl;
  const { xml } = owl.tags;
  const { whenReady } = owl.utils;
  const { useRef, useState } = owl.hooks;
  // -------------------------------------------------------------------------
  // Task Component
  // -------------------------------------------------------------------------
  const TASK_TEMPLATE = xml/* xml */ `
    <li class="todo" t-att-class="props.task.isCompleted ? 'completed' : ''">
        <input class="toggle" type="checkbox" t-att-checked="props.task.isCompleted" t-on-click="toggleTask" />
        <label><t t-esc="props.task.title"/></label>
        <button class="destroy" t-on-click="deleteTask"></button>
    </li>`;

  class Task extends Component {
    static template = TASK_TEMPLATE;
    static props = ["task"];
    toggleTask() {
      this.trigger("toggle-task", { id: this.props.task.id });
    }
    deleteTask() {
      this.trigger("delete-task", { id: this.props.task.id });
    }
  }
  // -------------------------------------------------------------------------
  // App Component
  // -------------------------------------------------------------------------
  const APP_TEMPLATE = xml/* xml */ `
    <section t-name="TodoList" class="todoapp">
    <header class="header">
    <h1>todos</h1>
    <input class="new-todo"  autocomplete="off" placeholder="What needs to be done?" t-ref="add-input" t-on-keyup="addTask"/>
    </header>
    <ul class="todo-list" t-on-toggle-task="toggleTask" t-on-delete-task="deleteTask" >
    <t t-foreach="tasks" t-as="task" t-key="task.id">
        <Task task="task"/>
    </t>
    </ul>
    </section>`;

  class App extends Component {
    static template = APP_TEMPLATE;
    static components = { Task };
    inputRef = useRef("add-input");
    mounted() {
      this.inputRef.el.focus();
    }
    addTask(ev) {
      // 13 is keycode for ENTER
      if (ev.keyCode === 13) {
        const title = ev.target.value.trim();
        ev.target.value = "";
        if (title) {
          const newTask = {
            id: this.nextId++,
            title: title,
            isCompleted: false,
          };
          this.tasks.push(newTask);
        }
      }
    }
    toggleTask(ev) {
      const task = this.tasks.find((t) => t.id === ev.detail.id);
      task.isCompleted = !task.isCompleted;
    }
    deleteTask(ev) {
      const index = this.tasks.findIndex((t) => t.id === ev.detail.id);
      this.tasks.splice(index, 1);
    }
    nextId = 1;
    //tasks = []
    tasks = useState([]);
  }

  // Setup code
  function setup() {
    const app = new App();
    app.mount(document.body);
  }

  whenReady(setup);
})();
