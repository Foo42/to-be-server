import { readFile } from 'fs-extra'
import { safeLoad } from 'js-yaml'
import { isArray } from 'util'
import { ListAction } from 'todo-to-be-core'
import { deserialiseListAction } from 'todo-to-be-core/build/src/core/listActions';

export function loadActionsFromYamlString (yaml: string): ListAction[] {
  const loaded = safeLoad(yaml)
  if (isArray(loaded)) {
    return loaded.map(deserialiseListAction)
  }
  throw new Error('invalid yaml. contents not an array')
}

export function loadActionsFromFile (filePath: string) {
  return readFile(filePath, 'utf8')
    .then(loadActionsFromYamlString)
}
