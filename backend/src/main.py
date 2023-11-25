import asyncio
import logging
from twentyfive.twentyfive_rsm import TwentyFive
from twentyfive_servicer import TwentyFiveServicer
from resemble.aio.applications import Application
from resemble.aio.workflows import Workflow

logging.basicConfig(level=logging.INFO)

STATE_MACHINE_ID = 'twentyfive12'


async def initialize(workflow: Workflow):
    twentyfive = TwentyFive(STATE_MACHINE_ID)

    # Is this needed?
    await twentyfive.AddTask(workflow, task="Eat 10 chickens")


async def main():
    application = Application(
        servicers=[TwentyFiveServicer],
        initialize=initialize,
    )

    logging.info('👋 Hello, World? Hello, Resemble! 👋')

    await application.run()


if __name__ == '__main__':
    asyncio.run(main())
