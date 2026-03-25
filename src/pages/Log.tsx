import { DeleteOutlined, LoadingOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  App,
  Button,
  DatePicker,
  Input,
  Pagination,
  Segmented,
  Space,
  Table,
  Tooltip,
  type InputRef,
  type TableColumnType,
  type TableProps
} from 'antd'
import type { FilterDropdownProps, SorterResult } from 'antd/es/table/interface'
import dayjs from 'dayjs'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Highlighter from 'react-highlight-words'
import type {
  EmailLogAdminResponse,
  ExceptionLogAdminResponse,
  SearchEmailLogAdminRequest,
  SearchExceptionLogAdminRequest
} from '@/types/log'
import {
  deleteEmailLogs,
  deleteExceptionLogs,
  searchEmailLogs,
  searchExceptionLogs
} from '@/api/admin/log'

const orderMap = {
  ascend: 'asc',
  descend: 'desc'
}

export default function EmailLog(): React.JSX.Element {
  const { t } = useTranslation('log')
  const { message } = App.useApp()
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sortField, setSortField] = useState<string | undefined>('id')
  const [sortOrder, setSortOrder] = useState<string | undefined>('asc')
  const [currentLogType, setCurrentLogType] = useState(0)
  const [deleteBeforeDate, setDeleteBeforeDate] = useState('')
  const [searchColumn, setSearchColumn] = useState('')
  const [searchText, setSearchText] = useState('')
  const searchInput = useRef<InputRef>(null)
  const queryClient = useQueryClient()

  const {
    data: emailLogsData,
    isFetching: isEmailLogFetching,
    refetch: refetchEmailLog
  } = useQuery({
    queryKey: ['emailLogs', pageIndex, pageSize, sortField, sortOrder, searchColumn, searchText],
    queryFn: () =>
      searchEmailLogs(pageIndex, pageSize, sortField, sortOrder, {
        [searchColumn]: searchText
      } as SearchEmailLogAdminRequest),
    placeholderData: keepPreviousData
  })
  const { list: emailLogList, total: emailLogTotal } = emailLogsData?.data ?? {}

  const {
    data: exceptionLogsData,
    isFetching: isExceptionLogFetching,
    refetch: refetchExceptionLog
  } = useQuery({
    queryKey: [
      'exceptionLogs',
      pageIndex,
      pageSize,
      sortField,
      sortOrder,
      searchColumn,
      searchText
    ],
    queryFn: () =>
      searchExceptionLogs(pageIndex, pageSize, sortField, sortOrder, {
        [searchColumn]: searchText
      } as SearchExceptionLogAdminRequest),
    placeholderData: keepPreviousData
  })
  const { list: exceptionLogList, total: exceptionLogTotal } = exceptionLogsData?.data ?? {}

  const deleteEmailLogsMutation = useMutation({
    mutationFn: ({ date, logType }: { date: string; logType: number }) =>
      logType === 0 ? deleteEmailLogs(date) : deleteExceptionLogs(date),
    onSuccess: (_, variables) => {
      setDeleteBeforeDate('')
      if (variables.logType === 0) {
        message.success(t('emailLogsDeleted'))
        queryClient.invalidateQueries({ queryKey: ['emailLogs'] })
      } else {
        message.success(t('exceptionLogsDeleted'))
        queryClient.invalidateQueries({ queryKey: ['exceptionLogs'] })
      }
    }
  })

  const LogTypeMap: Record<number, string> = {
    0: t('emailLog'),
    1: t('exceptionLog')
  }

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps['confirm'],
    dataIndex: string
  ) => {
    confirm()
    setSearchColumn(dataIndex)
    setSearchText(selectedKeys[0])
  }

  const getColumnSearchProps = <T extends object>(dataIndex: keyof T): TableColumnType<T> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div className="p-2 flex flex-col items-center" onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={t('searchField', { field: t(String(dataIndex)) })}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, String(dataIndex))}
          className="block mb-2 field-sizing-content"
        />
        <div className="w-full flex justify-between gap-2">
          <Button
            onClick={() => {
              clearFilters?.()
              setSelectedKeys([])
              confirm()
              setSearchColumn('')
              setSearchText('')
            }}
          >
            {t('clear')}
          </Button>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, String(dataIndex))}
          >
            {t('search')}
          </Button>
        </div>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#3142EF' : undefined }} />
    ),
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100)
        }
      }
    },
    render: (text) =>
      searchColumn === String(dataIndex) ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      )
  })

  const emailLogColumns: TableProps<EmailLogAdminResponse>['columns'] = [
    {
      title: t('id'),
      dataIndex: 'id',
      ellipsis: true,
      sorter: true,
      ...getColumnSearchProps<EmailLogAdminResponse>('id')
    },
    {
      title: t('sender'),
      dataIndex: 'sender',
      ellipsis: true,
      sorter: true,
      ...getColumnSearchProps<EmailLogAdminResponse>('sender')
    },
    {
      title: t('receiver'),
      dataIndex: 'receiver',
      ellipsis: true,
      sorter: true,
      ...getColumnSearchProps<EmailLogAdminResponse>('receiver')
    },
    {
      title: t('subject'),
      dataIndex: 'subject',
      ellipsis: true,
      sorter: true,
      ...getColumnSearchProps<EmailLogAdminResponse>('subject')
    },
    {
      title: t('createTime'),
      dataIndex: 'createTime',
      ellipsis: true,
      sorter: true
    }
  ]

  const exceptionLogColumns: TableProps<ExceptionLogAdminResponse>['columns'] = [
    {
      title: t('id'),
      dataIndex: 'id',
      ellipsis: true,
      sorter: true,
      ...getColumnSearchProps<ExceptionLogAdminResponse>('id')
    },
    {
      title: t('exception'),
      dataIndex: 'exception',
      ellipsis: true,
      sorter: true,
      ...getColumnSearchProps<ExceptionLogAdminResponse>('exception')
    },
    {
      title: t('message'),
      dataIndex: 'message',
      ellipsis: true,
      sorter: true,
      ...getColumnSearchProps<ExceptionLogAdminResponse>('message')
    },
    {
      title: t('ip'),
      dataIndex: 'ip',
      ellipsis: true,
      sorter: true,
      ...getColumnSearchProps<ExceptionLogAdminResponse>('ip')
    },
    {
      title: t('uri'),
      dataIndex: 'uri',
      ellipsis: true,
      sorter: true,
      ...getColumnSearchProps<ExceptionLogAdminResponse>('uri')
    },
    {
      title: t('method'),
      dataIndex: 'method',
      ellipsis: true,
      sorter: true,
      ...getColumnSearchProps<ExceptionLogAdminResponse>('method')
    },
    {
      title: t('createTime'),
      dataIndex: 'createTime',
      ellipsis: true,
      sorter: true
    }
  ]

  return (
    <div className="h-full w-full flex flex-col items-center gap-4 py-4 px-8">
      <div className="flex items-center justify-start gap-4">
        <Tooltip
          title={t('refresh')}
          arrow={false}
          classNames={{
            container: 'select-none'
          }}
        >
          <Button
            variant="filled"
            color="default"
            shape="circle"
            icon={<ReloadOutlined />}
            onClick={() => {
              if (currentLogType === 0) {
                refetchEmailLog().then(() => message.success(t('refreshed')))
              } else {
                refetchExceptionLog().then(() => message.success(t('refreshed')))
              }
            }}
          />
        </Tooltip>
        <Space.Compact>
          <DatePicker
            value={deleteBeforeDate ? dayjs(deleteBeforeDate) : null}
            onChange={(_, dateString) =>
              setDeleteBeforeDate(Array.isArray(dateString) ? (dateString[0] ?? '') : dateString)
            }
          />
          <Tooltip
            title={t('delete')}
            arrow={false}
            classNames={{
              container: 'select-none'
            }}
          >
            <Button
              variant="filled"
              color="red"
              disabled={!deleteBeforeDate}
              icon={<DeleteOutlined />}
              onClick={() =>
                deleteEmailLogsMutation.mutate({ date: deleteBeforeDate, logType: currentLogType })
              }
            >
              {t('deleteBeforeDate')}
            </Button>
          </Tooltip>
        </Space.Compact>

        <Segmented
          options={[
            { label: LogTypeMap[0], value: 0 },
            { label: LogTypeMap[1], value: 1 }
          ]}
          onChange={(value) => {
            setPageIndex(1)
            setCurrentLogType(Number(value))
          }}
        />
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-style">
        {currentLogType === 0 ? (
          <Table<EmailLogAdminResponse>
            rowKey="id"
            columns={emailLogColumns}
            dataSource={emailLogList}
            loading={{
              spinning: isEmailLogFetching,
              indicator: <LoadingOutlined spin />
            }}
            pagination={false}
            onChange={(_, __, sorter) => {
              const s = sorter as SorterResult<EmailLogAdminResponse>
              setSortField((s.field ?? 'id').toString())
              setSortOrder(orderMap[s.order ?? 'ascend'])
            }}
            classNames={{
              header: {
                wrapper: 'sticky top-0 z-10',
                cell: 'select-none'
              }
            }}
          />
        ) : (
          <Table<ExceptionLogAdminResponse>
            rowKey="id"
            columns={exceptionLogColumns}
            dataSource={exceptionLogList}
            loading={{
              spinning: isExceptionLogFetching,
              indicator: <LoadingOutlined spin />
            }}
            pagination={false}
            onChange={(_, __, sorter) => {
              const s = sorter as SorterResult<ExceptionLogAdminResponse>
              setSortField((s.field ?? 'id').toString())
              setSortOrder(orderMap[s.order ?? 'ascend'])
            }}
            classNames={{
              header: {
                wrapper: 'sticky top-0 z-10',
                cell: 'select-none'
              }
            }}
          />
        )}
      </div>
      <Pagination
        current={pageIndex}
        onChange={(page, pageSize) => {
          setPageIndex(page)
          setPageSize(pageSize)
        }}
        pageSize={pageSize}
        total={currentLogType === 0 ? emailLogTotal : exceptionLogTotal}
        showTotal={(total, range) => `${range[0]}-${range[1]} / ${total}`}
        showSizeChanger={{
          showSearch: false
        }}
      />
    </div>
  )
}
