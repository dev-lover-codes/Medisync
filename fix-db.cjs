const fs = require('fs');
let sql = fs.readFileSync('database_schema.sql', 'utf8');

if (!sql.includes('auth_id UUID')) {
    sql = sql.replace('user_id         SERIAL PRIMARY KEY,', 'user_id         SERIAL PRIMARY KEY,\n    auth_id         UUID UNIQUE NOT NULL,');
}

const fks = [
    {table: 'patients', col: 'user_id'},
    {table: 'doctors', col: 'user_id'},
    {table: 'doctors', col: 'department_id'},
    {table: 'appointments', col: 'doctor_id'},
    {table: 'appointments', col: 'department_id'},
    {table: 'appointments', col: 'parent_appointment_id'},
    {table: 'appointments', col: 'created_by'},
    {table: 'medical_records', col: 'appointment_id'},
    {table: 'prescriptions', col: 'medical_record_id'},
    {table: 'prescriptions', col: 'patient_id'},
    {table: 'prescriptions', col: 'doctor_id'},
    {table: 'beds', col: 'current_patient_id'},
    {table: 'billing', col: 'patient_id'},
    {table: 'billing', col: 'appointment_id'},
    {table: 'audit_logs', col: 'user_id'}
];

fks.forEach(fk => {
    const idxName = 'idx_' + fk.table + '_' + fk.col;
    if (!sql.includes(idxName)) {
        sql += '\nCREATE INDEX ' + idxName + ' ON ' + fk.table + '(' + fk.col + ');';
    }
});

sql = sql.replace(/\(current_setting\('request\.jwt\.claims', true\)::json->>'user_id'\)::int/g, 
    '(SELECT user_id FROM users WHERE auth_id = auth.uid())');

fs.writeFileSync('database_schema.sql', sql);
