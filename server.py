
import asyncio
import datetime
import json

import websockets

from asyncio.subprocess import PIPE, STDOUT


async def cpu_usage(websocket, path):
    while True:
        now = datetime.datetime.utcnow().isoformat() + 'Z'
        process = await asyncio.create_subprocess_shell(
            "iostat -n cpu",
            stdin=PIPE,
            stdout=PIPE,
            stderr=STDOUT
        )
        stdout_data, stderr_data = await process.communicate()
        cpu_usage = stdout_data.decode("utf-8")
        lines = cpu_usage.split("\n")
        header_items = lines[1].split()
        values = lines[2].split()
        cpu_data = dict(zip(header_items, values))
        output = {
            'ts': now,
            'data': cpu_data,
        }
        await websocket.send(json.dumps(output))
        await asyncio.sleep(0.5)


start_server = websockets.serve(cpu_usage, '127.0.0.1', 5678)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
