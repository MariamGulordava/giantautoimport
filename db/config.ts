import { defineDb, defineTable, column } from 'astro:db';

const Users = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    username: column.text(),
    hashed_password: column.text(),
    phone_number: column.text(),
    email: column.text(),
  }
})

const Session = defineTable({
	columns: {
		id: column.text({
			primaryKey: true
		}),
		expiresAt: column.date(),
		userId: column.text({
			references: () => Users.columns.id
		})
	}
});


export default defineDb({
  tables: { Users, Session },
})