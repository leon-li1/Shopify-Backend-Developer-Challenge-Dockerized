FROM python AS deps
WORKDIR /app
RUN addgroup --gid 1001 --system python
RUN adduser --system server -u 1001
USER server:python

COPY requirements.txt requirements.txt
RUN pip install --user -r requirements.txt

###############

FROM python AS builder
WORKDIR /app
RUN addgroup --gid 1001 --system python
RUN adduser --system server -u 1001

COPY schema.prisma schema.prisma
COPY --from=deps --chown=server:python /home/server/.local /home/server/.local
ENV PATH="/home/server/.local/bin:${PATH}"
# use an empty database just to generate the python package
RUN touch database.db
RUN chown server database.db .

USER server:python
RUN prisma db push

###############

FROM python AS runner
WORKDIR /app
RUN addgroup --gid 1001 --system python
RUN adduser --system server -u 1001

USER server:python

COPY --from=builder --chown=server:python /app/schema.prisma /app/schema.prisma
COPY --from=builder --chown=server:python /home/server/.local /home/server/.local
COPY --from=builder --chown=server:python /tmp/prisma/binaries/engines /tmp/prisma/binaries/engines
COPY --chown=server:python main.py main.py
ENV PATH="/home/server/.local/bin:${PATH}"

EXPOSE 8000
ENV PORT 8000
VOLUME /app/database.db

ENTRYPOINT [ "uvicorn", "main:app", "--reload" ]
