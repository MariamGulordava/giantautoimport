import { defineDb, defineTable, column } from 'astro:db';

const Users = defineTable({
  columns: {
    id: column.text(),
    username: column.text(),
    hashed_password: column.text(),
    phone_number: column.text(),
    email: column.text(),
  }
})

export default defineDb({
  tables: { Users },
})