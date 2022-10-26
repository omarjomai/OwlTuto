(function () {
  const { Component } = owl;
  const { xml } = owl.tags;
  const { whenReady } = owl.utils;

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
    </header>
    <ul class="todo-list">
    <t t-foreach="tasks" t-as="task" t-key="task.id">
        <Task task="task"/>
    </t>
    </ul>
    </section>`;

  class App extends Component {
    static template =APP_TEMPLATE;
    static components = { Task };

    tasks = [
      {
        id: 1,
        title: "task 1",
        isCompleted: true,
      },
      {
        id: 2,
        title: "task 2",
        isCompleted: false,
      },
    ];
  }

  // Setup code
  function setup() {
    const app = new App();
    app.mount(document.body);
  }

  whenReady(setup);
})();
