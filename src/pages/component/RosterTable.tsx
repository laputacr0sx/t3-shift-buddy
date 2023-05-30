import { useState } from "react";
import { Center, createStyles, Group, rem, ScrollArea, Table, Text, TextInput, UnstyledButton } from "@mantine/core";
import { keys } from "@mantine/utils";
import { IconChevronDown, IconChevronUp, IconSearch, IconSelector } from "@tabler/icons-react";

const useStyles = createStyles((theme) => ({
  th: {
    padding: "0 !important"
  },

  control: {
    width: "100%",
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0]
    }
  },

  icon: {
    width: rem(21),
    height: rem(21),
    borderRadius: rem(21)
  }
}));

interface RowData {
  dutyNumber: string;
  bNL: string;
  bNT: string;
  bFT: string;
  bFL: string;
  duration: string;
  remarks: string;
}

interface TableSortProps {
  data: RowData[];
}

interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;

  onSort(): void;
}

function Th({ children, reversed, sorted, onSort }: ThProps) {
  const { classes } = useStyles();
  const Icon = sorted
    ? reversed
      ? IconChevronUp
      : IconChevronDown
    : IconSelector;
  return (
    <th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group position="apart">
          <Text fw={500} fz="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon size="0.9rem" stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </th>
  );
}

function filterData(data: RowData[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter((item) => keys(data[0]).some((key) => item[key]));
  // return data.filter((item) => keys(data[0]).some((key) => item[key].toLowerCase().includes(query)));
}

function sortData(
  data: RowData[],
  payload: { sortBy: keyof RowData | null; reversed: boolean; search: string }
) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      if (payload.reversed) {
        return b[sortBy].localeCompare(a[sortBy]);
      }

      return a[sortBy].localeCompare(b[sortBy]);
    }),
    payload.search
  );
}

function RosterTable({ data }: TableSortProps) {
  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState<keyof RowData | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const setSorting = (field: keyof RowData) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(data, { sortBy: field, reversed, search }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(
      sortData(data, { sortBy, reversed: reverseSortDirection, search: value })
    );
  };

  const rows = sortedData.map((row) => (
    <tr key={row.dutyNumber}>
      <td>{row.dutyNumber}</td>
      <td>{row.bNL}</td>
      <td>{row.bNT}</td>
      <td>{row.bFT}</td>
      <td>{row.bFL}</td>
      <td>{row.duration}</td>
      <td>{row.remarks}</td>
    </tr>
  ));

  return (
    <ScrollArea>
      <TextInput
        placeholder="Search by any field"
        mb="md"
        icon={<IconSearch size="0.9rem" stroke={1.5} />}
        value={search}
        onChange={handleSearchChange}
      />
      <Table
        horizontalSpacing="md"
        verticalSpacing="xs"
        miw={700}
        sx={{ tableLayout: "fixed" }}
      >
        <thead>
        <tr>
          <Th
            sorted={sortBy === "dutyNumber"}
            reversed={reverseSortDirection}
            onSort={() => setSorting("dutyNumber")}
          >
            dutyNumber
          </Th>
          <Th
            sorted={sortBy === "bNL"}
            reversed={reverseSortDirection}
            onSort={() => setSorting("bNL")}
          >
            bNL
          </Th>
          <Th
            sorted={sortBy === "bNT"}
            reversed={reverseSortDirection}
            onSort={() => setSorting("bNT")}
          >
            bNT
          </Th>
          <Th
            sorted={sortBy === "bFT"}
            reversed={reverseSortDirection}
            onSort={() => setSorting("bFT")}
          >
            bFT
          </Th>
          <Th
            sorted={sortBy === "bFL"}
            reversed={reverseSortDirection}
            onSort={() => setSorting("bFL")}
          >
            bFL
          </Th>
          <Th
            sorted={sortBy === "duration"}
            reversed={reverseSortDirection}
            onSort={() => setSorting("duration")}
          >
            duration
          </Th>
          <Th
            sorted={sortBy === "remarks"}
            reversed={reverseSortDirection}
            onSort={() => setSorting("remarks")}
          >
            remarks
          </Th>
        </tr>
        </thead>
        <tbody>
        {rows.length > 0 ? (
          rows
        ) : (
          <tr>
            <td colSpan={Object.keys("asflkjasdf").length}>
              <Text weight={500} align="center">
                Nothing found
              </Text>
            </td>
          </tr>
        )}
        </tbody>
      </Table>
    </ScrollArea>
  );
}

export default RosterTable