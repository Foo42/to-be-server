import * as path from 'path'
import * as express from 'express'
import { loadActionsFromFile } from './file/load';
import { applyListAction, buildTodoTree, Todo, ListAction } from 'todo-to-be-core'

const defaultFilePath = path.join(process.cwd(), 'todo.log.yml')
const todoFilePath = process.env.TODO_FILE || defaultFilePath

const app = express()
const port = parseInt(process.env['PORT'] || '3000', 10)
app.listen(port)

app.get('/', (req, res) => res.send('hello'))
app.get('/tree', (req, res, next) => buildTreeFromFile(todoFilePath).then(tree => res.json(tree)).catch(next))

console.log(`listening on port ${port}`)

export function isIncomplete (todo: Todo): boolean {
  return !todo.complete
}

function buildTreeFromFile (todoFilePath: string, filter = isIncomplete) {
  return loadActionsFromFile(todoFilePath)
    .then(buildStateFromActions)
    .then(todos => todos.filter(filter))
    .then(todos => buildTodoTree(todos))
}

export function buildStateFromActions (actions: ListAction[]): Todo[] {
  return actions.reduce(applyListAction, [])
}