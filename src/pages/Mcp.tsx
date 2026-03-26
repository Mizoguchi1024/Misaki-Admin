import { LoadingOutlined, ReloadOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { App, Button, Table, type TableProps } from 'antd'
import { useTranslation } from 'react-i18next'
import type { McpServerAdminResponse } from '@/types/mcp'
import { listMcpServers } from '@/api/admin/mcp'

type McpToolTableItem = {
  key: string
  serverName: string
  toolName: string
  description: string
}

export default function Mcp(): React.JSX.Element {
  const { t } = useTranslation('mcp')
  const { message } = App.useApp()

  const { data, isFetching, refetch } = useQuery({
    queryKey: ['mcpServers'],
    queryFn: () => listMcpServers()
  })

  const list: McpToolTableItem[] = (data?.data ?? []).flatMap((server: McpServerAdminResponse) =>
    server.tools.map((tool) => ({
      key: `${server.name}-${tool.name}`,
      serverName: server.name,
      toolName: tool.name,
      description: tool.description
    }))
  )

  const columns: TableProps<McpToolTableItem>['columns'] = [
    {
      title: t('serverName'),
      dataIndex: 'serverName',
      ellipsis: true
    },
    {
      title: t('toolName'),
      dataIndex: 'toolName',
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
      <Button
        variant="filled"
        color="default"
        icon={<ReloadOutlined />}
        onClick={() => refetch().then(() => message.success(t('refreshed')))}
      >
        {t('refresh')}
      </Button>
      <div className="flex-1 overflow-y-auto scrollbar-style">
        <Table<McpToolTableItem>
          rowKey="key"
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
