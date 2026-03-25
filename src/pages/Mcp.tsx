import { LoadingOutlined, ReloadOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import {
  App,
  Button,
  Table,
  Tooltip,
  type TableProps
} from 'antd'
import { useTranslation } from 'react-i18next'
import type { McpServerAdminResponse } from '@/types/mcp'
import { listMcpServers } from '@/api/admin/mcp'

type DataIndex = keyof McpServerAdminResponse

export default function Mcp(): React.JSX.Element {
  const { t } = useTranslation('mcp')
  const { message } = App.useApp()

  const { data, isFetching, refetch } = useQuery({
    queryKey: ['mcpServers'],
    queryFn: () => listMcpServers()
  })

  const list = data?.data ?? []

  const columns: TableProps<McpServerAdminResponse>['columns'] = [
    {
      title: t('serverName'),
      dataIndex: 'name',
      ellipsis: true
    },
    {
      title: t('toolName'),
      dataIndex: 'name',
      ellipsis: true
    },
    {
      title: t('description'),
      dataIndex: 'description',
      ellipsis: true
    }
  ]

  return (
    <div className="h-full w-full flex flex-col items-center gap-4 py-4 px-8">
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
          onClick={() => refetch().then(() => message.success(t('refreshed')))}
        />
      </Tooltip>
      <div className="flex-1 overflow-y-auto scrollbar-style">
        <Table<McpServerAdminResponse>
          rowKey="toolName"
          columns={columns}
          dataSource={list}
          loading={{ spinning: isFetching, indicator: <LoadingOutlined spin /> }}
          pagination={false}
          classNames={{
            header: {
              wrapper: 'sticky top-0 z-10',
              cell: 'select-none'
            }
          }}
        />
      </div>
    </div>
  )
}
