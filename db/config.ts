import { defineDb, defineTable, column } from 'astro:db';

const User = defineTable({
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
			references: () => User.columns.id
		})
	}
});


export default defineDb({
  tables: { User, Session },
})