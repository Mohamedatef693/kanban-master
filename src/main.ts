declare const Swal: any;
const crudModal = document.getElementById("crud-modal");

const title = document.getElementById("title") as HTMLInputElement;

const priority = document.getElementById("priority") as HTMLSelectElement;

const dueDate = document.getElementById("dueDate") as HTMLInputElement;

const description = document.getElementById(
  "description",
) as HTMLTextAreaElement;

const todoContainer = document.getElementById("todoContainer") as HTMLElement;

const progressContainer = document.getElementById(
  "progressContainer",
) as HTMLElement;

const completedContainer = document.getElementById(
  "completedContainer",
) as HTMLElement;

const formSubmit = document.getElementById("formSubmit") as HTMLFormElement;

// ==================== Interface ====================

interface task {
  title: string;
  priority: string;
  dueDate: string;
  description: string;
  creatTime: string;
  status: "todo" | "progress" | "completed";
}

let tasks: task[] = JSON.parse(localStorage.getItem("tasks") ?? "[]");

// Task currently being edited
let editingTaskIndex: number | null = null;

// ==================== Modal ====================

function closeModel() {
  const closeButtons = document.querySelectorAll(".closeModel");

  closeButtons.forEach((item) => {
    item.addEventListener("click", () => {
      crudModal?.classList.add("hidden");

      // Exit edit mode
      editingTaskIndex = null;

      clearForm();

      // Reset modal title
      const modalTitle = crudModal?.querySelector("h3");

      if (modalTitle) {
        modalTitle.textContent = "Create New Task";
      }

      // Reset submit button
      const submitButton = document.getElementById(
        "btnsubmit",
      ) as HTMLButtonElement | null;

      if (submitButton) {
        submitButton.innerHTML = `
          <span>+</span>
          <span>Add Task</span>
        `;
      }
    });
  });
}

function openModel() {
  const openButton = document.getElementById("openModel");

  openButton?.addEventListener("click", () => {
    // Add mode
    editingTaskIndex = null;

    clearForm();

    const modalTitle = crudModal?.querySelector("h3");

    if (modalTitle) {
      modalTitle.textContent = "Create New Task";
    }

    const submitButton = document.getElementById(
      "btnsubmit",
    ) as HTMLButtonElement | null;

    if (submitButton) {
      submitButton.innerHTML = `
        <span>+</span>
        <span>Add Task</span>
      `;
    }

    // Open modal
    crudModal?.classList.remove("hidden");
  });
}

// ==================== Add Task ====================

function addTask() {
  const task1: task = {
    title: title.value.trim(),
    priority: priority.value,
    dueDate: dueDate.value,
    description: description.value.trim(),
    creatTime: new Date().toISOString(),
    status: "todo",
  };

  tasks.push(task1);

  localStorage.setItem("tasks", JSON.stringify(tasks));

  clearForm();

  show();
}

// ==================== Show ====================

function show() {
  const empty = `
    <div
      class="flex-1 flex flex-col items-center justify-center gap-2 py-16 px-6"
    >
      <svg
        class="w-10 h-10 text-slate-300"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path
          d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"
        />
      </svg>

      <p class="text-sm font-medium text-slate-400">
        No tasks yet
      </p>

      <p class="text-xs text-slate-300">
        Click + to add one
      </p>
    </div>
  `;

  // =========================
  // Reset
  // =========================

  todoContainer.innerHTML = "";
  progressContainer.innerHTML = "";
  completedContainer.innerHTML = "";

  // =========================
  // Task HTML
  // =========================

  const createTaskHTML = (item: task, index: number) => {
    const count = index.toString().padStart(3, "0");

    return `
      <div
        class="group w-full my-2  bg-white border border-red-100 rounded-2xl p-5 shadow-sm space-y-4 hover:shadow-md transition-all"
      >

        <!-- Header -->

        <div
          class="flex items-center justify-between text-slate-400 text-xs font-semibold"
        >

          <div class="flex items-center gap-2">

            <span
              class="w-2 h-2 rounded-full bg-slate-300 inline-block"
            ></span>

            <span>#${count}</span>

          </div>

          <!-- Edit / Delete -->

          <div
            class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >

            <!-- Edit -->

            <button
              type="button"
              data-index="${index}"
              class="editTask p-2 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
              title="Edit"
            >

              <svg
                class="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >

                <path d="M12 20h9" />

                <path
                  d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"
                />

              </svg>

            </button>

            <!-- Delete -->

            <button
              type="button"
              data-index="${index}"
              class="deleteTask p-2 hover:text-red-600 hover:bg-slate-100 rounded-lg transition-colors"
              title="Delete"
            >

              <svg
                class="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >

                <path d="M3 6h18" />
                <path d="M8 6V4h8v2" />
                <path d="M19 6l-1 14H6L5 6" />
                <path d="M10 11v5" />
                <path d="M14 11v5" />

              </svg>

            </button>

          </div>

        </div>

        <!-- Content -->

        <div class="space-y-1.5">

          <h3
            class="text-slate-800 font-bold text-lg leading-snug"
          >
            ${item.title}
          </h3>

          <p
            class="text-slate-500 text-sm leading-relaxed line-clamp-2"
          >
            ${item.description}
          </p>

        </div>

        <!-- Priority -->

        <div
          class="flex flex-wrap items-center gap-2 pt-1"
        >

          <span
            class="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full"
          >

            <span
              class="w-1.5 h-1.5 rounded-full bg-blue-500"
            ></span>

            ${item.priority}

          </span>

        </div>

        <!-- Date -->

        <div
          class="flex flex-wrap items-center gap-4 text-xs font-medium pt-1"
        >

          <div
            class="flex items-center gap-1.5 text-red-500 font-semibold"
          >
            <span>${item.dueDate}</span>
          </div>

          <div
            class="flex items-center gap-1.5 text-slate-400"
          >

            <span
              class="time"
              data-time="${index}"
            >
              Just now
            </span>

          </div>

        </div>

        <!-- Status Actions -->

        <div
          class="border-t border-slate-100 pt-2"
        >

          <div
            class="flex flex-wrap items-center gap-2 pt-1"
          >

            ${
              item.status === "todo"
                ? `
                  <button
                    data-index="${index}"
                    type="button"
                    class="startTask inline-flex items-center gap-2 px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs font-bold rounded-xl transition-colors"
                  >
                    Start
                  </button>

                  <button
                    data-index="${index}"
                    type="button"
                    class="completeTask inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-bold rounded-xl transition-colors"
                  >
                    Complete
                  </button>
                `
                : item.status === "progress"
                  ? `
                    <button
                      data-index="${index}"
                      type="button"
                      class="undoTask inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                    >
                      Undo
                    </button>

                    <button
                      data-index="${index}"
                      type="button"
                      class="completeTask inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-bold rounded-xl transition-colors"
                    >
                      Complete
                    </button>
                  `
                  : `
                    <button
                      data-index="${index}"
                      type="button"
                      class="startTask inline-flex items-center gap-2 px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs font-bold rounded-xl transition-colors"
                    >
                      Start
                    </button>
                  `
            }

          </div>

        </div>

      </div>
    `;
  };

  // =========================
  // Separate Tasks
  // =========================

  const todoTasks = tasks.filter((item) => item.status === "todo");

  const progressTasks = tasks.filter((item) => item.status === "progress");

  const completedTasks = tasks.filter((item) => item.status === "completed");

  // =========================
  // Render Using map
  // =========================

  todoContainer.innerHTML =
    todoTasks.length > 0
      ? todoTasks
          .map((item) => {
            const index = tasks.indexOf(item);

            return createTaskHTML(item, index);
          })
          .join("")
      : empty;

  progressContainer.innerHTML =
    progressTasks.length > 0
      ? progressTasks
          .map((item) => {
            const index = tasks.indexOf(item);

            return createTaskHTML(item, index);
          })
          .join("")
      : empty;

  completedContainer.innerHTML =
    completedTasks.length > 0
      ? completedTasks
          .map((item) => {
            const index = tasks.indexOf(item);

            return createTaskHTML(item, index);
          })
          .join("")
      : empty;

  // =========================
  // Start
  // =========================

  document.querySelectorAll(".startTask").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number((button as HTMLElement).dataset.index);

      if (!tasks[index]) return;

      tasks[index].status = "progress";

      localStorage.setItem("tasks", JSON.stringify(tasks));

      show();
    });
  });

  // =========================
  // Undo
  // Progress → Todo
  // =========================

  document.querySelectorAll(".undoTask").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number((button as HTMLElement).dataset.index);

      if (!tasks[index]) return;

      tasks[index].status = "todo";

      localStorage.setItem("tasks", JSON.stringify(tasks));

      show();
    });
  });

  // =========================
  // Complete
  // =========================

  document.querySelectorAll(".completeTask").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number((button as HTMLElement).dataset.index);

      if (!tasks[index]) return;

      tasks[index].status = "completed";

      localStorage.setItem("tasks", JSON.stringify(tasks));

      show();
    });
  });

  // =========================
  // Edit
  // =========================

  document.querySelectorAll(".editTask").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number((button as HTMLElement).dataset.index);

      const task = tasks[index];

      if (!task) return;

      editingTaskIndex = index;

      title.value = task.title;

      priority.value = task.priority;

      dueDate.value = task.dueDate;

      description.value = task.description;

      const modalTitle = crudModal?.querySelector("h3");

      if (modalTitle) {
        modalTitle.textContent = "Edit Task";
      }

      const submitButton = document.getElementById(
        "btnsubmit",
      ) as HTMLButtonElement | null;

      if (submitButton) {
        submitButton.innerHTML = `
            <span>✓</span>
            <span>Save Changes</span>
          `;
      }

      crudModal?.classList.remove("hidden");
    });
  });

  // =========================
  // Delete
  // =========================

  document.querySelectorAll(".deleteTask").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number((button as HTMLElement).dataset.index);

      deleteTask(index);
    });
  });
}

// ==================== Delete Task ====================

function deleteTask(index: number) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result: any) => {
    if (result.isConfirmed) {
      tasks.splice(index, 1);

      localStorage.setItem("tasks", JSON.stringify(tasks));

      show();

      Swal.fire({
        title: "Deleted!",
        text: "Your task has been deleted.",
        icon: "success",
      });
    }
  });
}

// ==================== Clear Form ====================

function clearForm() {
  title.value = "";

  priority.value = "medium";

  dueDate.value = "";

  description.value = "";

  document.getElementById("validDate")?.classList.add("hidden");
}

// ==================== Time ====================

function time() {
  setInterval(() => {
    const now = new Date();

    tasks.forEach((item, index) => {
      const creatTime = new Date(item.creatTime);

      const deff = now.getTime() - creatTime.getTime();

      const seconds = Math.floor(deff / 1000);

      const minutes = Math.floor(seconds / 60);

      const hours = Math.floor(minutes / 60);

      const day = Math.floor(hours / 24);

      const timeElement = document.querySelector(
        `[data-time="${index}"]`,
      ) as HTMLSpanElement | null;

      if (!timeElement) return;

      if (seconds < 60) {
        timeElement.textContent = "Just now";

        return;
      }

      if (minutes < 60) {
        timeElement.textContent = `${minutes} minute${
          minutes > 1 ? "s" : ""
        } ago`;

        return;
      }

      if (hours < 24) {
        timeElement.textContent = `${hours} hour${hours > 1 ? "s" : ""} ago`;

        return;
      }

      timeElement.textContent = `${day} day${day > 1 ? "s" : ""} ago`;
    });
  }, 1000);
}

// ==================== Valid Date ====================

function validDate() {
  const errorElement = document.getElementById("validDate");

  const dateValue = dueDate.value;

  if (!dateValue) {
    if (errorElement) {
      errorElement.textContent = "Please select a due date";

      errorElement.classList.remove("hidden");
    }

    return false;
  }

  const selectedDate = new Date(dateValue);

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    if (errorElement) {
      errorElement.textContent = "Due date cannot be in the past";

      errorElement.classList.remove("hidden");
    }

    return false;
  }

  errorElement?.classList.add("hidden");

  return true;
}

// ==================== Date Event ====================

dueDate.addEventListener("input", () => {
  document.getElementById("validDate")?.classList.add("hidden");
});

// ==================== Submit ====================

formSubmit.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!validDate()) {
    return;
  }
  if (editingTaskIndex !== null) {
    const task = tasks[editingTaskIndex];

    if (!task) return;

    task.title = title.value.trim();

    task.priority = priority.value;

    task.dueDate = dueDate.value;

    task.description = description.value.trim();

    localStorage.setItem("tasks", JSON.stringify(tasks));

    // Exit edit mode

    editingTaskIndex = null;

    clearForm();

    // Reset modal title

    const modalTitle = crudModal?.querySelector("h3");

    if (modalTitle) {
      modalTitle.textContent = "Create New Task";
    }

    // Reset submit button

    const submitButton = document.getElementById(
      "btnsubmit",
    ) as HTMLButtonElement | null;

    if (submitButton) {
      submitButton.innerHTML = `
          <span>+</span>
          <span>Add Task</span>
        `;
    }

    // Close modal

    crudModal?.classList.add("hidden");

    // Render

    show();

    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Task updated successfully",
      showConfirmButton: false,
      timer: 1500,
    });

    return;
  }

  // =========================
  // ADD
  // =========================

  addTask();

  crudModal?.classList.add("hidden");

  Swal.fire({
    position: "top-end",
    icon: "success",
    title: "Your work has been saved",
    showConfirmButton: false,
    timer: 1500,
  });
});

// ==================== Start App ====================

openModel();

show();

closeModel();

time();
