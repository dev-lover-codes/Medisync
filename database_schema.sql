CREATE TABLE users (
    user_id         SERIAL PRIMARY KEY,
    email           VARCHAR(100) UNIQUE NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    role            VARCHAR(20) NOT NULL CHECK (role IN ('admin','doctor','nurse','receptionist','pharmacist','patient')),
    linked_id       INT,
    is_active       BOOLEAN DEFAULT TRUE,
    last_login      TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE departments (
    department_id       SERIAL PRIMARY KEY,
    name                VARCHAR(100) NOT NULL,
    code                VARCHAR(10) UNIQUE NOT NULL,
    floor_number        INT,
    daily_opd_limit     INT DEFAULT 100,
    is_active           BOOLEAN DEFAULT TRUE
);

CREATE TABLE patients (
    patient_id              SERIAL PRIMARY KEY,
    user_id                 INT REFERENCES users(user_id), -- Link to users for authentication
    uhid                    VARCHAR(20) UNIQUE,
    first_name              VARCHAR(50) NOT NULL,
    last_name               VARCHAR(50) NOT NULL,
    date_of_birth           DATE NOT NULL,
    gender                  CHAR(1) NOT NULL CHECK (gender IN ('M','F','O')),
    blood_group             VARCHAR(3) CHECK (blood_group IN ('A+','A-','B+','B-','AB+','AB-','O+','O-')),
    phone                   VARCHAR(15) UNIQUE NOT NULL,
    email                   VARCHAR(100) UNIQUE,
    address                 TEXT,
    state                   VARCHAR(50),
    pincode                 VARCHAR(10),
    nationality             VARCHAR(50) DEFAULT 'Indian',
    guardian_relation       VARCHAR(3) CHECK (guardian_relation IN ('S/o','D/o','W/o','H/o')),
    guardian_name           VARCHAR(100),
    id_type                 VARCHAR(20) CHECK (id_type IN ('Aadhaar','Voter ID','Passport','PAN','Other')),
    id_number               VARCHAR(50),
    emergency_contact_name  VARCHAR(100),
    emergency_contact_phone VARCHAR(15),
    is_active               BOOLEAN DEFAULT TRUE,
    deleted_at              TIMESTAMPTZ DEFAULT NULL,
    created_at              TIMESTAMPTZ DEFAULT NOW(),
    updated_at              TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE doctors (
    doctor_id           SERIAL PRIMARY KEY,
    user_id             INT NOT NULL REFERENCES users(user_id),
    department_id       INT NOT NULL REFERENCES departments(department_id),
    first_name          VARCHAR(50) NOT NULL,
    last_name           VARCHAR(50) NOT NULL,
    specialization      VARCHAR(100),
    qualification       VARCHAR(100),
    phone               VARCHAR(15),
    email               VARCHAR(100),
    consultation_fee    DECIMAL(10,2) DEFAULT 0,
    is_active           BOOLEAN DEFAULT TRUE,
    deleted_at          TIMESTAMPTZ DEFAULT NULL,
    created_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE appointments (
    appointment_id          SERIAL PRIMARY KEY,
    opd_reg_number          VARCHAR(20) UNIQUE,
    patient_id              INT NOT NULL REFERENCES patients(patient_id),
    doctor_id               INT NOT NULL REFERENCES doctors(doctor_id),
    department_id           INT NOT NULL REFERENCES departments(department_id),
    appointment_date        DATE NOT NULL,
    appointment_time        TIME NOT NULL,
    token_number            INT,
    status                  VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled','completed','cancelled','no-show')),
    type                    VARCHAR(20) DEFAULT 'OPD' CHECK (type IN ('OPD','IPD','emergency','followup')),
    complaint_text          TEXT,
    visit_number            INT DEFAULT 1,
    is_followup             BOOLEAN DEFAULT FALSE,
    parent_appointment_id   INT REFERENCES appointments(appointment_id),
    id_type                 VARCHAR(20),
    id_number               VARCHAR(50),
    created_by              INT REFERENCES users(user_id),
    deleted_at              TIMESTAMPTZ DEFAULT NULL,
    created_at              TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE medical_records (
    record_id       SERIAL PRIMARY KEY,
    appointment_id  INT NOT NULL REFERENCES appointments(appointment_id),
    patient_id      INT NOT NULL REFERENCES patients(patient_id),
    doctor_id       INT NOT NULL REFERENCES doctors(doctor_id),
    symptoms        TEXT,
    diagnosis       TEXT,
    notes           TEXT,
    blood_pressure  VARCHAR(10),
    temperature     DECIMAL(4,1),
    pulse           INT,
    weight          DECIMAL(5,2),
    spo2            INT,
    follow_up_date  DATE,
    deleted_at      TIMESTAMPTZ DEFAULT NULL,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE prescriptions (
    prescription_id     SERIAL PRIMARY KEY,
    medical_record_id   INT NOT NULL REFERENCES medical_records(record_id),
    patient_id          INT NOT NULL REFERENCES patients(patient_id),
    doctor_id           INT NOT NULL REFERENCES doctors(doctor_id),
    notes               TEXT,
    is_dispensed        BOOLEAN DEFAULT FALSE,
    deleted_at          TIMESTAMPTZ DEFAULT NULL,
    issued_at           TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE beds (
    bed_id              SERIAL PRIMARY KEY,
    bed_number          VARCHAR(10) NOT NULL,
    department_id       INT NOT NULL REFERENCES departments(department_id),
    ward_name           VARCHAR(50),
    bed_type            VARCHAR(20) DEFAULT 'general' CHECK (bed_type IN ('general','ICU','emergency','private','maternity')),
    status              VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available','occupied','maintenance','reserved')),
    current_patient_id  INT REFERENCES patients(patient_id),
    admitted_at         TIMESTAMPTZ,
    created_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE billing (
    bill_id             SERIAL PRIMARY KEY,
    patient_id          INT NOT NULL REFERENCES patients(patient_id),
    appointment_id      INT NOT NULL REFERENCES appointments(appointment_id),
    consultation_fee    DECIMAL(10,2) DEFAULT 0,
    admission_fee       DECIMAL(10,2) DEFAULT 0,
    other_charges       DECIMAL(10,2) DEFAULT 0,
    total_amount        DECIMAL(10,2) DEFAULT 0,
    paid_amount         DECIMAL(10,2) DEFAULT 0,
    payment_status      VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending','partial','paid','waived')),
    payment_mode        VARCHAR(20) CHECK (payment_mode IN ('cash','UPI','card','insurance','Ayushman')),
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE audit_logs (
    log_id      SERIAL PRIMARY KEY,
    user_id     INT REFERENCES users(user_id),
    action      VARCHAR(50) NOT NULL,
    table_name  VARCHAR(50),
    record_id   INT,
    ip_address  VARCHAR(45),
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes on appointments
CREATE INDEX idx_apt_doctor_date 
ON appointments(doctor_id, appointment_date);

CREATE INDEX idx_apt_patient 
ON appointments(patient_id);

CREATE INDEX idx_apt_date_status 
ON appointments(appointment_date, status);

-- Indexes on medical_records
CREATE INDEX idx_records_patient 
ON medical_records(patient_id);

CREATE INDEX idx_records_doctor 
ON medical_records(doctor_id);

-- Indexes on beds
CREATE INDEX idx_beds_status_dept 
ON beds(status, department_id);

-- Indexes on patients
CREATE INDEX idx_patients_phone 
ON patients(phone);

CREATE INDEX idx_patients_uhid 
ON patients(uhid);

-- Trigger 1 — auto updated_at on patients
CREATE OR REPLACE FUNCTION fn_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_patients_updated_at
BEFORE UPDATE ON patients
FOR EACH ROW EXECUTE FUNCTION fn_updated_at();

CREATE TRIGGER trg_billing_updated_at
BEFORE UPDATE ON billing
FOR EACH ROW EXECUTE FUNCTION fn_updated_at();

-- Trigger 2 — auto-generate UHID on new patient
CREATE OR REPLACE FUNCTION fn_generate_uhid()
RETURNS TRIGGER AS $$
BEGIN
    NEW.uhid = 'MED-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(NEW.patient_id::TEXT, 6, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_generate_uhid
BEFORE INSERT ON patients
FOR EACH ROW EXECUTE FUNCTION fn_generate_uhid();

-- Trigger 3 — enforce department OPD daily limit
CREATE OR REPLACE FUNCTION fn_check_opd_limit()
RETURNS TRIGGER AS $$
DECLARE
    current_count INT;
    dept_limit    INT;
BEGIN
    SELECT COUNT(*) INTO current_count
    FROM appointments
    WHERE department_id = NEW.department_id
    AND appointment_date = NEW.appointment_date
    AND status != 'cancelled';

    SELECT daily_opd_limit INTO dept_limit
    FROM departments
    WHERE department_id = NEW.department_id;

    IF current_count >= dept_limit THEN
        RAISE EXCEPTION 'OPD limit reached for this department on this date. Max: %', dept_limit;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_opd_limit
BEFORE INSERT ON appointments
FOR EACH ROW EXECUTE FUNCTION fn_check_opd_limit();

-- Trigger 4 — auto-create billing on appointment completion
CREATE OR REPLACE FUNCTION fn_auto_bill()
RETURNS TRIGGER AS $$
DECLARE
    fee DECIMAL(10,2);
BEGIN
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        SELECT consultation_fee INTO fee
        FROM doctors WHERE doctor_id = NEW.doctor_id;

        INSERT INTO billing (
            patient_id, appointment_id,
            consultation_fee, total_amount,
            payment_status
        ) VALUES (
            NEW.patient_id, NEW.appointment_id,
            fee, fee,
            'pending'
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_auto_bill
AFTER UPDATE ON appointments
FOR EACH ROW EXECUTE FUNCTION fn_auto_bill();

-- Procedure 1 — book appointment with conflict detection
CREATE OR REPLACE FUNCTION book_appointment(
    p_patient_id    INT,
    p_doctor_id     INT,
    p_dept_id       INT,
    p_date          DATE,
    p_time          TIME,
    p_complaint     TEXT,
    p_created_by    INT
)
RETURNS TABLE(appointment_id INT, opd_reg_number VARCHAR, token_number INT)
AS $$
DECLARE
    v_conflict      INT;
    v_token         INT;
    v_opd_reg       VARCHAR;
    v_apt_id        INT;
BEGIN
    -- Check doctor slot conflict
    SELECT COUNT(*) INTO v_conflict
    FROM appointments
    WHERE doctor_id = p_doctor_id
    AND appointment_date = p_date
    AND appointment_time = p_time
    AND status NOT IN ('cancelled');

    IF v_conflict > 0 THEN
        RAISE EXCEPTION 'Doctor already has an appointment at this time slot';
    END IF;

    -- Generate token number for that day + department
    SELECT COALESCE(MAX(a.token_number), 0) + 1 INTO v_token
    FROM appointments a
    WHERE a.department_id = p_dept_id
    AND a.appointment_date = p_date;

    -- Generate OPD reg number
    v_opd_reg := TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(v_token::TEXT, 4, '0');

    -- Insert appointment
    INSERT INTO appointments (
        patient_id, doctor_id, department_id,
        appointment_date, appointment_time,
        token_number, opd_reg_number,
        complaint_text, created_by
    ) VALUES (
        p_patient_id, p_doctor_id, p_dept_id,
        p_date, p_time,
        v_token, v_opd_reg,
        p_complaint, p_created_by
    ) RETURNING appointments.appointment_id INTO v_apt_id;

    RETURN QUERY SELECT v_apt_id, v_opd_reg, v_token;
END;
$$ LANGUAGE plpgsql;

-- Procedure 2 — assign bed with row lock
CREATE OR REPLACE FUNCTION assign_bed(
    p_patient_id    INT,
    p_dept_id       INT,
    p_bed_type      VARCHAR
)
RETURNS TABLE(bed_id INT, bed_number VARCHAR, ward_name VARCHAR)
AS $$
DECLARE
    v_bed_id    INT;
    v_bed_num   VARCHAR;
    v_ward      VARCHAR;
BEGIN
    -- Lock and find first available bed
    SELECT b.bed_id, b.bed_number, b.ward_name
    INTO v_bed_id, v_bed_num, v_ward
    FROM beds b
    WHERE b.department_id = p_dept_id
    AND b.bed_type = p_bed_type
    AND b.status = 'available'
    ORDER BY b.bed_id
    LIMIT 1
    FOR UPDATE SKIP LOCKED;

    IF v_bed_id IS NULL THEN
        RAISE EXCEPTION 'No available % bed in this department', p_bed_type;
    END IF;

    -- Assign the bed
    UPDATE beds SET
        status = 'occupied',
        current_patient_id = p_patient_id,
        admitted_at = NOW()
    WHERE beds.bed_id = v_bed_id;

    -- Log to audit
    INSERT INTO audit_logs(user_id, action, table_name, record_id)
    VALUES (p_patient_id, 'BED_ASSIGNED', 'beds', v_bed_id);

    RETURN QUERY SELECT v_bed_id, v_bed_num, v_ward;
END;
$$ LANGUAGE plpgsql;

-- Procedure 3 — discharge patient
CREATE OR REPLACE FUNCTION discharge_patient(
    p_patient_id    INT,
    p_bed_id        INT,
    p_user_id       INT
)
RETURNS VOID AS $$
BEGIN
    -- Verify bed belongs to this patient
    IF NOT EXISTS (
        SELECT 1 FROM beds
        WHERE bed_id = p_bed_id
        AND current_patient_id = p_patient_id
    ) THEN
        RAISE EXCEPTION 'This bed is not assigned to this patient';
    END IF;

    -- Free the bed
    UPDATE beds SET
        status = 'available',
        current_patient_id = NULL,
        admitted_at = NULL
    WHERE bed_id = p_bed_id;

    -- Log discharge
    INSERT INTO audit_logs(user_id, action, table_name, record_id)
    VALUES (p_user_id, 'PATIENT_DISCHARGED', 'beds', p_bed_id);
END;
$$ LANGUAGE plpgsql;

-- View 1 — doctor schedule
CREATE OR REPLACE VIEW doctor_schedule AS
SELECT
    a.appointment_id,
    a.opd_reg_number,
    a.appointment_date,
    a.appointment_time,
    a.token_number,
    a.status,
    a.type,
    a.complaint_text,
    a.visit_number,
    a.is_followup,
    p.patient_id,
    p.first_name || ' ' || p.last_name   AS patient_name,
    p.phone                               AS patient_phone,
    p.date_of_birth,
    p.blood_group,
    d.doctor_id,
    d.first_name || ' ' || d.last_name   AS doctor_name,
    dept.name                             AS department_name
FROM appointments a
JOIN patients p    ON a.patient_id    = p.patient_id
JOIN doctors d     ON a.doctor_id     = d.doctor_id
JOIN departments dept ON a.department_id = dept.department_id
WHERE a.deleted_at IS NULL
AND p.deleted_at   IS NULL;

-- View 2 — bed occupancy
CREATE OR REPLACE VIEW bed_occupancy AS
SELECT
    b.bed_id,
    b.bed_number,
    b.ward_name,
    b.bed_type,
    b.status,
    b.admitted_at,
    dept.name                               AS department_name,
    p.patient_id,
    p.first_name || ' ' || p.last_name     AS patient_name,
    p.phone                                 AS patient_phone,
    EXTRACT(EPOCH FROM (NOW() - b.admitted_at))/3600 AS hours_admitted
FROM beds b
JOIN departments dept   ON b.department_id      = dept.department_id
LEFT JOIN patients p    ON b.current_patient_id = p.patient_id;

-- View 3 — patient summary
CREATE OR REPLACE VIEW patient_summary AS
SELECT
    p.patient_id,
    p.uhid,
    p.first_name || ' ' || p.last_name     AS full_name,
    p.date_of_birth,
    p.gender,
    p.blood_group,
    p.phone,
    p.guardian_relation,
    p.guardian_name,
    COUNT(DISTINCT a.appointment_id)        AS total_visits,
    MAX(a.appointment_date)                 AS last_visit_date,
    (SELECT mr.diagnosis
     FROM medical_records mr
     WHERE mr.patient_id = p.patient_id
     ORDER BY mr.created_at DESC
     LIMIT 1)                               AS last_diagnosis
FROM patients p
LEFT JOIN appointments a ON p.patient_id = a.patient_id
WHERE p.deleted_at IS NULL
AND p.is_active = TRUE
GROUP BY p.patient_id;

-- View 4 — department OPD load
CREATE OR REPLACE VIEW dept_opd_load AS
SELECT
    dept.department_id,
    dept.name                               AS department_name,
    dept.daily_opd_limit,
    COUNT(a.appointment_id)                 AS todays_bookings,
    dept.daily_opd_limit - COUNT(a.appointment_id) AS slots_remaining,
    ROUND(COUNT(a.appointment_id)::DECIMAL /
          NULLIF(dept.daily_opd_limit, 0) * 100, 1) AS capacity_percent
FROM departments dept
LEFT JOIN appointments a
    ON dept.department_id = a.department_id
    AND a.appointment_date = CURRENT_DATE
    AND a.status != 'cancelled'
GROUP BY dept.department_id;

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE beds ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Utility Function to get current user role/id from JWT claims
-- This assumes you are using Supabase Auth and have mapped user_id to a custom claim or use a mapping table.
-- For now, we will use a placeholder logic that can be adapted.

-- 1. Departments: Readable by everyone, editable only by admin
CREATE POLICY "Departments are viewable by all authenticated users" 
ON departments FOR SELECT USING (true);

CREATE POLICY "Departments are manageable only by admins" 
ON departments FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE user_id = (current_setting('request.jwt.claims', true)::json->>'user_id')::int AND role = 'admin')
);

-- 2. Patients:
-- Doctors can see patients they have appointments with
-- Patients can see their own record
-- Admins/Receptionists can see all
CREATE POLICY "Patients viewable by staff or self" 
ON patients FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM users u 
        WHERE u.user_id = (current_setting('request.jwt.claims', true)::json->>'user_id')::int
        AND (
            u.role IN ('admin', 'receptionist', 'nurse')
            OR (u.role = 'doctor' AND EXISTS (
                SELECT 1 FROM appointments a 
                JOIN doctors d ON a.doctor_id = d.doctor_id 
                WHERE a.patient_id = patients.patient_id AND d.user_id = u.user_id
            ))
            OR (u.role = 'patient' AND patients.user_id = u.user_id)
        )
    )
);

-- 3. Appointments:
-- Doctors see their own appointments
-- Patients see their own
-- Staff see all
CREATE POLICY "Appointments access policy" 
ON appointments FOR ALL USING (
    EXISTS (
        SELECT 1 FROM users u 
        WHERE u.user_id = (current_setting('request.jwt.claims', true)::json->>'user_id')::int
        AND (
            u.role IN ('admin', 'receptionist')
            OR (u.role = 'doctor' AND doctor_id = (SELECT doctor_id FROM doctors WHERE user_id = u.user_id))
            OR (u.role = 'patient' AND patient_id = (SELECT patient_id FROM patients WHERE user_id = u.user_id))
        )
    )
);

-- 4. Medical Records:
-- Only assigned doctors and the patient themselves can see
CREATE POLICY "Medical records access policy" 
ON medical_records FOR ALL USING (
    EXISTS (
        SELECT 1 FROM users u 
        WHERE u.user_id = (current_setting('request.jwt.claims', true)::json->>'user_id')::int
        AND (
            u.role = 'admin'
            OR (u.role = 'doctor' AND doctor_id = (SELECT doctor_id FROM doctors WHERE user_id = u.user_id))
            OR (u.role = 'patient' AND patient_id = (SELECT patient_id FROM patients WHERE user_id = u.user_id))
        )
    )
);

-- 5. Billing:
-- Patients see their own, admins/receptionists see all
CREATE POLICY "Billing access policy" 
ON billing FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM users u 
        WHERE u.user_id = (current_setting('request.jwt.claims', true)::json->>'user_id')::int
        AND (
            u.role IN ('admin', 'receptionist')
            OR (u.role = 'patient' AND patient_id = (SELECT patient_id FROM patients WHERE user_id = u.user_id))
        )
    )
);

-- 6. Audit Logs:
-- Only admins can see audit logs
CREATE POLICY "Only admins can view audit logs" 
ON audit_logs FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE user_id = (current_setting('request.jwt.claims', true)::json->>'user_id')::int AND role = 'admin')
);
