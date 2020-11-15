import React, { useState, useEffect } from 'react'
import Table from 'react-bootstrap/Table'
import styled from 'styled-components'
import { Formik } from 'formik'
import Input from './input'
import { Row } from 'react-bootstrap'
import { Container} from 'react-bootstrap'
import { Form } from 'react-bootstrap'
import { Card } from 'react-bootstrap'
import { Button } from 'react-bootstrap'

const Wrapper = styled.div`
    background: #f5f5f5;
    width: 100%;
    height: 100%;
`
const Title = styled.h1`
    font-family: 'Roboto', sans-serif;
`

const CalculateSalary = (totalHours) => {
    const isss = totalHours * 0.0525;
    const afp = totalHours * 0.0688;
    const renta = totalHours * 0.1;
    return {
        isss: isss.toFixed(2), afp: afp.toFixed(2), renta: renta.toFixed(2),
        total: (totalHours - (isss + afp + renta)).toFixed(2),
    };
}

const CalculateHours = (hours) => {
    if (hours <= 160) {
        return hours * 9.75;
    } 
    if (hours > 160 && hours <= 200) {
        const firstHours = 160 * 9.75;
        const secondHours = (hours - 160) * 11.5;
        return firstHours + secondHours;
    } 
    if (hours > 200 && hours <= 250) {
        const firstHours = 160 * 9.75;
        const secondHours = (40) * 11.5;
        const thirdHours = (hours - 200) * 12.5;
        return firstHours + secondHours + thirdHours;
    }
    if (hours > 250) {
        
        return 0
    } 
    return 0
}

const Calculator = () => {
    const [ code, setCode ] = useState("");
    const [ name, setName ] = useState("");
    const [ hours, setHours ] = useState("");
    const [ baseSalary, setBaseSalary ] = useState(0);
    const [ calculated, setCalculated ] = useState(false);
    const [ salary, setSalary ] = useState({ isss: 0, afp: 0, renta: 0, total: 0 });

    useEffect(() => {
        localStorage.clear();
        localStorage.setItem("salary", JSON.stringify([]));
    }, []);

    useEffect(() => {
        if (code !== '' && name !== '' && hours !== '' && hours <=250 && !calculated) {
            const totalHours = CalculateHours(hours);
            setBaseSalary(totalHours);
            const totalSalary = CalculateSalary(totalHours);
            setSalary(totalSalary);
            // save to local storage
            const storedSalary = localStorage.getItem("salary");
            const previousSalary = storedSalary ? JSON.parse(storedSalary) : [];
            const currentSalary = {
                code,
                name,
                hours,
                baseSalary: totalHours, 
                salary: totalSalary
            }
            previousSalary.push(currentSalary);
            localStorage.setItem("salary", JSON.stringify(previousSalary));
            setCalculated(true);
        }
    }, [code, name, hours, calculated]); 

    const localSalaryObj = localStorage.getItem("salary");
    const localSalary = localSalaryObj !== null && localSalaryObj !== undefined && localSalaryObj !== '' ? JSON.parse(localSalaryObj) : [];

    return (
        <Wrapper>
            <div class="d-flex justify-content-center p-4">
            <Title>CALCULADORA DE SALARIO</Title>
            </div>
        
            <Formik
       initialValues={{ code: '', name: '', hours: '' }}
       onSubmit={(values, actions) => {
           console.log(values);
           const {code, hours, name } = values;
           setCode(code);
           setName(name);
           setHours(hours);
           setCalculated(false);
            actions.setSubmitting(false);
       }}
     >
       {props => (
           <Container> 
           <Row >
            <div class="col-12 d-flex justify-content-center">
                <div class="card bg-light mb-3 w-75">
                <div class="card-header">AGREGAR REGISTRO</div>
                <div class="card-body">
                    <Form onSubmit={props.handleSubmit}>
                    <Form.Group>
                        <Form.Control  label="Código de empleado :" placeholder="Código de empleado" type="text" name="code" value={props.values.code} onChange={props.handleChange} onBlur={props.handleBlur} error={props.errors.code}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Control label="Nombre de empleado :" placeholder="Nombre de empleado" type="text" name="name" value={props.values.name} onChange={props.handleChange} onBlur={props.handleBlur} error={props.errors.name}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Control label="Horas trabajadas al mes :" placeholder="Horas trabajadas" type="number" name="hours" value={props.values.hours} onChange={props.handleChange} onBlur={props.handleBlur} error={props.errors.hours}/>
                    </Form.Group>
                    <Form.Group>
                    <button class="btn btn-success w-100" type="submit">Agregar</button>
                    </Form.Group>
                    </Form>
                </div>
                </div>
            </div>
         </Row>
         </Container> 
       )}
     </Formik>
     <Container> 
         <Row>
     <Table striped bordered hover>
            <thead>
                <tr>
                    <th class="text-center">Código de empleado</th>
                    <th class="text-center" >Nombre de empleado</th>
                    <th class="text-center" >Horas trabajadas</th>
                    <th class="text-center" >Sueldo base</th>
                    <th class="text-center" >ISSS</th>
                    <th class="text-center">AFP</th>
                    <th class="text-center" >Renta</th>
                    <th class="text-center" >Sueldo total</th>
                </tr>
            </thead>
            <tbody>
                {localSalary.map((item, i) => {
                    const { code, name, hours, baseSalary, salary } = item;
                    return (
                        <tr key={`${item.code} + ${i}`}>
                            <td>{code}</td>
                            <td>{name}</td>
                            <td>{hours}</td>
                            <td>${(parseFloat(baseSalary)).toFixed(2)}</td>
                            <td>${(parseFloat(salary.isss)).toFixed(2)}</td>
                            <td>${(parseFloat(salary.afp)).toFixed(2)}</td>
                            <td>${(parseFloat(salary.renta)).toFixed(2)}</td>
                            <td>${(parseFloat(salary.total)).toFixed(2)}</td>
                        </tr>
                    );
                })}
            </tbody>
        </Table>
        </Row>
     </Container>
        </Wrapper>
    )
}

export default Calculator