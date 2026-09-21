// ==============================
// DOM elements
// ==============================

const form = document.getElementById("commentForm");
const nameInput = document.getElementById("name");
const commentInput = document.getElementById("comment");

const nameError = document.getElementById("nameError");
const commentError = document.getElementById("commentError");
const generalError = document.getElementById("generalError");
const successMessage = document.getElementById("successMessage");

const commentsList = document.getElementById("commentsList");
const emptyMessage = document.getElementById("emptyMessage");
const characterCount = document.getElementById("characterCount");

// ==============================
// const
// ==============================

const MIN_NAME_LENGTH = 2;
const MIN_COMMENT_LENGTH = 10;
const MAX_COMMENT_LENGTH = 500;

// ==============================
// validation functions
// ==============================

function cleanText(value) {
    return value.trim().replace(/\s+/g, " ");
}

function validateName() {
    const name = cleanText(nameInput.value);
    let message = "";

    if (name.length < MIN_NAME_LENGTH) {
        message =
            `Le nom doit contenir au moins ${MIN_NAME_LENGTH} caractères.`;
    }

    nameError.textContent = message;
    nameInput.classList.toggle("invalid", message !== "");
    nameInput.setAttribute("aria-invalid", String(message !== ""));

    return message === "";
}

function validateComment() {
    const comment = cleanText(commentInput.value);
    let message = "";

    if (comment.length < MIN_COMMENT_LENGTH) {
        message =
            `Le commentaire doit contenir au moins ${MIN_COMMENT_LENGTH} caractères.`;
    } else if (comment.length > MAX_COMMENT_LENGTH) {
        message =
            `Le commentaire ne doit pas dépasser ${MAX_COMMENT_LENGTH} caractères.`;
    }

    commentError.textContent = message;
    commentInput.classList.toggle("invalid", message !== "");
    commentInput.setAttribute("aria-invalid", String(message !== ""));

    return message === "";
}

function updateCharacterCount() {
    characterCount.textContent = String(commentInput.value.length);
}

function updateEmptyMessage() {
    const hasComment =
        commentsList.querySelector(".comment-card") !== null;

    emptyMessage.hidden = hasComment;
}

// ==============================
// comment creation
// ==============================

function createComment(author, text) {
    const article = document.createElement("article");
    article.className = "comment-card";

    const title = document.createElement("h3");
    title.textContent = author;

    const paragraph = document.createElement("p");
    paragraph.textContent = text;

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.type = "button";
    deleteButton.setAttribute(
        "aria-label",
        `Supprimer le commentaire de ${author}`
    );

    const icon = document.createElement("span");
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = "🗑️";

    deleteButton.append(icon, " Supprimer");
    article.append(title, paragraph, deleteButton);

    return article;
}

// ==============================
// forms submit
// ==============================

form.addEventListener("submit", function (event) {
    event.preventDefault();

    generalError.hidden = true;
    generalError.textContent = "";
    successMessage.textContent = "";

    const isNameValid = validateName();
    const isCommentValid = validateComment();

    if (!isNameValid || !isCommentValid) {
        generalError.textContent =
            !isNameValid
                ? "Le nom doit contenir au moins 2 caractères."
                : "Le commentaire doit contenir au moins 10 caractères.";

        generalError.hidden = false;

        const firstInvalidField = form.querySelector(".invalid");

        if (firstInvalidField) {
            firstInvalidField.focus();
        }

        return;
    }

    const author = cleanText(nameInput.value);
    const text = cleanText(commentInput.value);

    const newComment = createComment(author, text);
    commentsList.prepend(newComment);

    form.reset();
    nameInput.classList.remove("invalid");
    commentInput.classList.remove("invalid");
    nameInput.removeAttribute("aria-invalid");
    commentInput.removeAttribute("aria-invalid");

    nameError.textContent = "";
    commentError.textContent = "";
    updateCharacterCount();
    updateEmptyMessage();

    successMessage.textContent = "Votre commentaire a bien été publié.";
    nameInput.focus();
});

nameInput.addEventListener("input", function () {
    successMessage.textContent = "";

    if (nameInput.classList.contains("invalid")) {
        validateName();
    }
});

nameInput.addEventListener("blur", validateName);

commentInput.addEventListener("input", function () {
    successMessage.textContent = "";
    updateCharacterCount();

    if (commentInput.classList.contains("invalid")) {
        validateComment();
    }
});

commentInput.addEventListener("blur", validateComment);

// ==============================
// comments suppression
// ==============================

commentsList.addEventListener("click", function (event) {
    const deleteButton = event.target.closest(".delete-button");

    if (!deleteButton) {
        return;
    }

    const commentCard = deleteButton.closest(".comment-card");

    if (commentCard) {
        commentCard.remove();
        updateEmptyMessage();
    }
});

// ==============================
// initialisation
// ==============================

updateCharacterCount();
updateEmptyMessage();