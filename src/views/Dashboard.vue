<template>
  <div class="p-4">
    <h1>Dash Board</h1>
    <button
      type="button"
      class="btn btn-secondary addButton"
      @click="isShowForm=true"
    >
      Add New Note
    </button>
    <transition name="fade">
    <div v-if="isShowForm">
      <div class="modal">
        <div class="modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Add New note</h5>
              <button
                @click="isShowForm=false"
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="addNote">
                <div class="form-group">
                  <label for="title">Title</label>
                  <input type="text"
                    v-model="newNote.title"
                    class="form-control"
                    id="title"
                    aria-describedby="titleId"
                    placeholder="Enter a title"
                  >
                  <small id="titleId" class="form-text text-muted">
                    Enter a descriptive title for your note.
                  </small>
                </div>
                <div class="form-group">
                  <label for="note">Note</label>
                  <textarea
                    v-model="newNote.note"
                    class="form-control"
                    name="note"
                    id="note"
                    rows="3"
                    placeholder="Eneter your note"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  class="btn btn-primary float-right"
                  :disabled=!isValid
                >Add Note</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-backdrop show"></div>
    </div>
    </transition>

    <section class="mt-4">
      <div
        v-for="note in notes"
        :key="note._id"
        class="card border-primary mb-3"
      >
        <div class="card-header bg-primary text-white h4">{{ note.title }}</div>
        <div class="card-body">
          <p class="card-text" v-html="renderMarkDown(note.note)"></p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt();

const API_URL = 'http://localhost:1337';

export default {
  name: 'Dashboard',
  data() {
    return {
      isShowForm: false,
      newNote: {
        title: '',
        note: '',
      },
      notes: [],
    };
  },
  computed: {
    isValid() {
      return this.newNote.title && this.newNote.note;
    },
  },
  methods: {
    renderMarkDown(note) {
      return md.render(note);
    },
    async addNote() {
      console.log(this.newNote);
      const result = await fetch(`${API_URL}/api/v1/notes`, {
        method: 'POST',
        body: JSON.stringify(this.newNote),
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${localStorage.token}`,
        },
      });
      const createdNote = await result.json();
      this.notes.push(createdNote);
      this.newNote = {
        title: '',
        note: '',
      };
      this.isShowForm = false;
    },
    async getNotes() {
      const result = await fetch(`${API_URL}/api/v1/notes`, {
        headers: {
          authorization: `Bearer ${localStorage.token}`,
        },
      });
      if (result.ok) {
        this.notes = await result.json();
      } else {
        const error = await result.json();
        console.log(error);
      }
    },
  },
  created() {
    this.getNotes();
  },
};
</script>

<style>
.addButton {
  position: fixed;
  bottom: 5%;
  right: 5%;
  z-index: 1;
}

.modal {
  display: block;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .15s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
