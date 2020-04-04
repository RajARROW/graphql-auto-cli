const fs = require('fs');
const { writeFile, writeFileWithFolderPath, writeFileIfExist } = require('./common');
const {basicFiles} = require('./const');
const basicScema = [];
module.exports.init = async (dir) => {
    console.log('hello world!!', dir);
    const rawdata = fs.readFileSync('/Users/mac/Desktop/temp.json');
    const student = JSON.parse(rawdata);
    const promise = basicFiles.map(res => {
        if (res.path) {
            writeFileWithFolderPath(res.path, res.fileName, res.data);
        } else {
            writeFile(res.fileName, res.data);
        }
    });
    generateModels(student);
    generateSchema(student);
    generateResolver(student);
    generateResolverIndex(student);
    await Promise.all(promise);
}

generateModels = (data) => {
    data.map(res => {
        const schema = mapModel(res.fields).reduce(((r, c) => Object.assign(r, c)), {});
        basicScema.push({name:res.modelName, data: schema});
        const schemaData = JSON.stringify(schema, null, 2).replace(/"'([^"']+(?='"))'"/g, '$1').replace(/['"]+/g, '').replace(/\\/g, '\'');
        const data = `
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ${res.modelName}Schema = new Schema (
${schemaData}
)
module.exports = mongoose.model('${res.modelName}', ${res.modelName}Schema);`
        writeFileWithFolderPath('./models', '/'+res.modelName+'.js', data);
    })
}

generateSchema = async (data) => {
    const model = data.map(res => {
        return res.modelName;
    });
    let indexImport = `import { gql } from 'apollo-server-express';\n`;
    let allSchema = '';
    let mutation = '';
    let query = '';
    model.map((res) => {
        const indexs = `import { ${res}Type } from './query/${res}';\nimport { ${res}Input} from './mutation/${res}';\n`;
        indexImport = indexImport+indexs;
        const schema = `\${${res}Type}\n\${${res}Input}\n`;
        allSchema = allSchema + schema;
        query = query + `\nget${makeFirstLaterCapital(res)}(_id: ID!): ${makeFirstLaterCapital(res)}`
        mutation = mutation + `\ncreate${makeFirstLaterCapital(res)}(${res}Input: ${res}Input): ${makeFirstLaterCapital(res)}`
        // writeFileWithFolderPath('./graphql/schema', '/index.js', index);
        // await writeFileIfExist('./graphql/schema', '/index.js', index);
    });
    const all = `const schema = \` ${allSchema} 
    type Query {
        ${query}
    }
    type Mutation {
        ${mutation}
    }
    schema {
        query: Query
        mutation: Mutation
    }
    \`
const TYPEDEFS = gql(schema);
export default TYPEDEFS;`
    await writeFileIfExist('./graphql/schema', '/index.js', indexImport);
    await writeFileIfExist('./graphql/schema', '/index.js', all);
    data.map(res => {
        const v = res.fields.map(res => {
            if (res.fieldType.includes('_ID')) {
                return {[res.fieldName]: 'ID'};
            }
            return {[res.fieldName]: res.fieldType}
        });
        let schema = v.reduce(((r, c) => Object.assign(r, c)), {});
        schema = JSON.stringify(schema, null, 2).replace(/['"]+/g, '').replace(/[',]+/g, '');
        const types = `export const ${res.modelName}Type = \`\ntype ${makeFirstLaterCapital(res.modelName)} ${schema}\`;`;
        const input = `export const ${res.modelName}Input = \`\ninput ${res.modelName}Input ${schema}\`;`
        writeFileWithFolderPath('./graphql/schema/query', '/'+res.modelName+'.js', types);
        writeFileWithFolderPath('./graphql/schema/mutation', '/'+res.modelName+'.js', input);
    });
}

generateResolver = async (data) => {
    const model = data.map(res => {
        return res.modelName;
    });
    let indexImport = `import { ObjectId } from 'mongodb';\nimport bcrypt from 'bcryptjs';\n`;
    query = '';
    mutation = '';
    model.map((res) => {
        const indexs = `import ${res} from '../../../models/${res}';`
        indexImport = indexImport+indexs;
        query = query + `export const get${makeFirstLaterCapital(res)} = async (root, {_id}) => {
            return await ${res}.findOne({_id: _id}).catch(err => {
                throw new Error("User not found");
            });
        }`;
        mutation = mutation + `export const create${makeFirstLaterCapital(res)} = async (root, {${res}Input}) => {
            return ${res}.create(${res}Input).catch(err => {
                throw new Error(err);
            });
        }`
        const finalQueryDataToWrite = `${indexImport}
        ${query}`;
        const finalMutationDataToWrite = `${indexImport}
        ${mutation}`;
        writeFileWithFolderPath('./graphql/resolvers/query', '/'+res+'.js', finalQueryDataToWrite);
        writeFileWithFolderPath('./graphql/resolvers/mutation', '/'+res+'.js', finalMutationDataToWrite);
        query = '';
        mutation = '';
    });
}

generateResolverIndex = async (data) => {
    const model = data.map(res => {
        return res.modelName;
    });
    let indexImport = ``;
    let query;
    let mutation;
    model.map((res) => {
        const indexs = `import { get${makeFirstLaterCapital(res)} } from './query/${res}';\nimport { create${makeFirstLaterCapital(res)}} from './mutation/${res}';\n`;
        indexImport = indexImport+indexs;
        query = Object.assign({ [`get${makeFirstLaterCapital(res)}`]: `get${makeFirstLaterCapital(res)}` }, query);
        mutation = Object.assign({ [`create${makeFirstLaterCapital(res)}`]: `create${makeFirstLaterCapital(res)}` }, mutation);
        // writeFileWithFolderPath('./graphql/schema', '/index.js', index);
        // await writeFileIfExist('./graphql/schema', '/index.js', index);
    });
    query = JSON.stringify(query);
    query = query.replace(/['"]+/g, '');
    mutation = JSON.stringify(mutation);
    mutation = mutation.replace(/['"]+/g, '');
    const all = `const RESOLVERS = {
        Query: 
            ${query}
        ,
        Mutation: 
            ${mutation}
        
    }
    export default RESOLVERS;`;
    await writeFileIfExist('./graphql/resolvers', '/index.js', indexImport);
    await writeFileIfExist('./graphql/resolvers', '/index.js', all);
}

mapModel = (data) => {
    return data.map(res => {
        
        if (!res.fieldType.includes('_ID')) {
            console.log(res.fieldType.includes('_ID'), res.fieldType);
            if (res.fieldType === 'ID') {
                return;
            }
            return {
                [res.fieldName]: {
                    type: res.fieldType,
                    require: res.required
                }
            }
        } else {
            return {
                [res.fieldName]: [{
                    type: `'Schema.Types.ObjectId'`,
                    ref: `"'${res.fieldType.split('_')[0]}'"`
                }]
            }
        }
    })
}

makeFirstLaterCapital = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}