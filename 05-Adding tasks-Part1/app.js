(function () {
  const { Component } = owl;
  const { xml } = owl.tags;
  const { whenReady } = owl.utils;
  const { useRef } = owl.hooks;
  // -------------------------------------------------------------------------
  // Task Component
  // -------------------------------------------------------------------------
  const TASK_TEMPLATE = xml/* xml */ `
    <li class="todo" t-att-class="props.task.isCompleted ? 'completed' : ''">
        <input class="toggle" type="checkbox" t-att-checked="props.task.isCompleted"/>
        <label><t t-esc="props.task.title"/></label>
    </li>`;

  class Task extends Component {
    static template = TASK_TEMPLATE;
    static props = ["task"];
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
    <ul class="todo-list">
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
        console.log("adding task", title);
        // todo
      }
    }

    tasks = [];
  }

  // Setup code
  function setup() {
    const app = new App();
    app.mount(document.body);
  }

  whenReady(setup);
})();

