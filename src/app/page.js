'use client'

import Image from "next/image"
import useSWR from 'swr'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Spinner from 'react-bootstrap/Spinner'
import styles from "./page.module.css"

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Home() {

  const { data, error, isLoading, isValidating } = useSWR("/api/tasks", fetcher, {
    refreshInterval: 300000, // 5 minutes in milliseconds
  })
  if (error) return <div>Failed to load</div>
  if (isLoading) return <div>Loading...</div>
  return (
    <div className="my-5">
      <Container>
        <Row>
          <Col>
            <h1 className="fs-3 border-bottom mb-5">Task Master - Close</h1>
          </Col>
        </Row>
        <Row>
          {data?.tasksDueByUser && Object.entries(data.tasksDueByUser).map(([user, count]) => (
            <Col key={user} xs={12} md={6} lg={4}>
              <div className="border rounded p-3 mb-3 position-relative">
                <h3>{user}</h3>
                <p className="fs-1">{count}</p>
                {isValidating && (
                  <div className="position-absolute top-5 end-0 translate-middle">
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </div>
                )}
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}
