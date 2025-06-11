// Seleciona os elementos principais
const form = document.querySelector("form");
const input = document.querySelector("#new-item");
const itemList = document.querySelector("#item-list");
const emptyMessage = document.querySelector(".empty-list-message");
const alertBox = document.querySelector(".alert");
const closeAlertButton = alertBox.querySelector("button");
let alertTimeoutId = null;


// Função que verifica se a lista está “vazia” (apenas o item oculto presente)
function checkIfListIsEmpty() {
  const visibleItems = [...itemList.children].filter(
    (li) => !li.classList.contains("hidden")
  );
  if (visibleItems.length === 0) {
    emptyMessage.classList.remove("hidden");
  }
}

// Função para criar um novo item na lista
function createItem(text) {
  const li = document.createElement("li");
  li.classList.add("list-item");

  const checkboxId = `item-${Date.now()}`;

  // Label oculto para acessibilidade
  const label = document.createElement("label");
  label.setAttribute("for", checkboxId);
  label.classList.add("sr-only");
  label.textContent = "Marcar como concluído";

  // Checkbox que risca o texto ao ser marcado
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = checkboxId;
  checkbox.name = checkboxId;

const p = document.createElement("p");
p.textContent = text;

// Clique para editar o texto
p.addEventListener("click", () => {
  const currentText = p.textContent;
  const inputEdit = document.createElement("input");
  inputEdit.type = "text";
  inputEdit.value = currentText;
  inputEdit.className = "edit-input";
  inputEdit.style.flex = "1";
  inputEdit.style.padding = "8px";
  inputEdit.style.borderRadius = "8px";
  inputEdit.style.border = "1px solid var(--color-border)";
  inputEdit.style.font = "inherit";

  // Substitui o <p> pelo input
  li.replaceChild(inputEdit, p);
  inputEdit.focus();

  const cancelEdit = () => {
    li.replaceChild(p, inputEdit);
  };

  inputEdit.addEventListener("keydown", (e) => {
    if (e.key === "Escape") cancelEdit();
    if (e.key === "Enter") inputEdit.blur();
  });

  inputEdit.addEventListener("blur", () => {
    const newValue = inputEdit.value.trim();

    // Validação
    if (newValue === "" || /^[0-9\s]+$/.test(newValue)) {
      alert("O texto deve conter letras.");
      cancelEdit();
      return;
    }

    p.textContent = newValue;
    li.replaceChild(p, inputEdit);
  });
});

  checkbox.addEventListener("change", () => {
    p.style.textDecoration = checkbox.checked ? "line-through" : "none";
  });

  // Botão de remover item com SVG copiado do modelo
  const removeBtn = document.createElement("button");
  removeBtn.classList.add("remove-item");
  const modelBtn = document.querySelector(".remove-item");
  removeBtn.innerHTML = modelBtn.innerHTML;

  removeBtn.addEventListener("click", () => {
    li.remove();
    alertBox.classList.remove("hidden");
    checkIfListIsEmpty();

    
    // Limpa o timeout anterior, se existir
    if (alertTimeoutId) clearTimeout(alertTimeoutId);

    // Define um novo timeout para esconder o alerta após 4 segundos
    alertTimeoutId = setTimeout(() => {
      alertBox.classList.add("hidden");
    }, 3000);
  });

  // Monta e adiciona o item à lista
  li.append(label, checkbox, p, removeBtn);
  itemList.appendChild(li);
}

// Fecha o alerta
closeAlertButton.addEventListener("click", () => {
  alertBox.classList.add("hidden");
});

// Envia o formulário
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const value = input.value.trim();

  // Validação: não vazio e não só números
  if (value === "" || /^[0-9\s]+$/.test(value)) {
    alert("Por favor, insira um item válido com letras.");
    return;
  }

  createItem(value);
  input.value = "";

  // Oculta mensagens
  emptyMessage.classList.add("hidden");
  alertBox.classList.add("hidden");
});