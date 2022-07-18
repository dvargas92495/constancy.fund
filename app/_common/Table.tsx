import { useLoaderData, useMatches, useNavigate } from "@remix-run/react";
import styled from "styled-components";

const StyledTable = styled.table`
  border-collapse: collapse;
  text-indent: 0;
  border-width: 2px;
  border-color: #888888;
  border-style: solid;
`;

const Row = styled.tr<{ index: number }>`
  background: ${(props) => (props.index % 2 === 0 ? "#eeeeee" : "#dddddd")};
  cursor: pointer;

  &:hover {
    background: #cccccc;
  }
`;

const Cell = styled.td`
  padding: 12px;
`;

const Header = styled.th`
  padding: 12px;
`;

const HeaderRow = styled.tr`
  background: #dddddd;
`;

const Table = () => {
  const { data, columns } = useLoaderData<{
    data: Record<string, string>[];
    columns: { key: string; label: string }[];
  }>();
  const navigate = useNavigate();
  const match = useMatches().slice(-1)?.[0].pathname;
  return (
    <StyledTable>
      <thead>
        <HeaderRow>
          {columns.map((c) => (
            <Header key={c.key}>{c.label}</Header>
          ))}
        </HeaderRow>
      </thead>
      <tbody>
        {data.map((a, index) => (
          <Row
            key={a.uuid}
            index={index}
            onClick={() =>
              navigate(`${match.replace(/\/index$/, "")}/${a.uuid}`)
            }
          >
            {columns.map((c) => (
              <Cell key={c.key}>{a[c.key]}</Cell>
            ))}
          </Row>
        ))}
      </tbody>
    </StyledTable>
  );
};

export default Table;
